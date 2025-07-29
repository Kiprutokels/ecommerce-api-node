"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_1 = require("@/config/swagger");
const redis_1 = __importDefault(require("@/config/redis"));
const routes_1 = __importDefault(require("@/routes"));
const error_middleware_1 = require("@/middleware/error.middleware");
dotenv_1.default.config();
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
        this.connectServices();
    }
    initializeMiddleware() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN?.split(",") || [
                "http://localhost:3000",
            ],
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: 1000,
            message: "Too many requests from this IP, please try again later.",
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.app.use("/api/", limiter);
        this.app.use(express_1.default.json({ limit: "10mb" }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
        this.app.use((0, compression_1.default)());
        if (process.env.NODE_ENV === "development") {
            this.app.use((0, morgan_1.default)("dev"));
        }
        else {
            this.app.use((0, morgan_1.default)("combined"));
        }
        this.app.get("/health", (req, res) => {
            res.status(200).json({
                status: "OK",
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
                version: process.env.npm_package_version || "1.0.0",
            });
        });
        this.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
            explorer: true,
            customCss: ".swagger-ui .topbar { display: none }",
            customSiteTitle: "E-commerce API Documentation",
        }));
    }
    initializeRoutes() {
        this.app.use("/api", routes_1.default);
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.notFoundHandler);
        this.app.use(error_middleware_1.errorHandler);
    }
    async connectServices() {
        try {
            await redis_1.default.connect();
        }
        catch (error) {
            console.error("Failed to connect to services:", error);
            process.exit(1);
        }
    }
    listen() {
        const PORT = process.env.PORT || 8000;
        this.app.listen(PORT, () => {
            console.log(`
🚀 Server is running on port ${PORT}
📚 API Documentation: http://localhost:${PORT}/api-docs
🏥 Health Check: http://localhost:${PORT}/health
🌍 Environment: ${process.env.NODE_ENV || "development"}
      `);
        });
        process.on("SIGTERM", this.gracefulShutdown);
        process.on("SIGINT", this.gracefulShutdown);
    }
    gracefulShutdown = async (signal) => {
        console.log(`\n👋 Received ${signal}, shutting down gracefully...`);
        try {
            await redis_1.default.disconnect();
            console.log("✅ Redis disconnected");
            process.exit(0);
        }
        catch (error) {
            console.error("❌ Error during shutdown:", error);
            process.exit(1);
        }
    };
}
const app = new App();
app.listen();
exports.default = app;
//# sourceMappingURL=app.js.map