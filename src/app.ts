// src/app.ts
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

import { swaggerSpec } from "@/config/swagger";
import redisClient from "@/config/redis";
import routes from "@/routes";
import { errorHandler, notFoundHandler } from "@/middleware/error.middleware";

// Load environment variables
dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.connectServices();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN?.split(",") || [
          "http://localhost:3000",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
      message: "Too many requests from this IP, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use("/api/", limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    } else {
      this.app.use(morgan("combined"));
    }

    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || "1.0.0",
      });
    });

    // API documentation
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "E-commerce API Documentation",
      })
    );
  }

  private initializeRoutes(): void {
    this.app.use("/api", routes);
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private async connectServices(): Promise<void> {
    try {
      // Connect to Redis
      await redisClient.connect();
    } catch (error) {
      console.error("Failed to connect to services:", error);
      process.exit(1);
    }
  }

  public listen(): void {
    const PORT = process.env.PORT || 8000;

    this.app.listen(PORT, () => {
      console.log(`
🚀 Server is running on port ${PORT}
📚 API Documentation: http://localhost:${PORT}/api-docs
🏥 Health Check: http://localhost:${PORT}/health
🌍 Environment: ${process.env.NODE_ENV || "development"}
      `);
    });

    // Graceful shutdown
    process.on("SIGTERM", this.gracefulShutdown);
    process.on("SIGINT", this.gracefulShutdown);
  }

  private gracefulShutdown = async (signal: string): Promise<void> => {
    console.log(`\n👋 Received ${signal}, shutting down gracefully...`);

    try {
      await redisClient.disconnect();
      console.log("✅ Redis disconnected");

      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  };
}

const app = new App();
app.listen();

export default app;
