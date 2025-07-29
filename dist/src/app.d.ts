import { Application } from "express";
declare class App {
    app: Application;
    constructor();
    private initializeMiddleware;
    private initializeRoutes;
    private initializeErrorHandling;
    private connectServices;
    listen(): void;
    private gracefulShutdown;
}
declare const app: App;
export default app;
//# sourceMappingURL=app.d.ts.map