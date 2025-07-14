"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const socketRoutes_1 = require("./routes/socketRoutes");
const socketMiddleware_1 = require("./middleware/socketMiddleware");
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
// Functional server setup
const createQuizServer = () => {
    const app = (0, express_1.default)();
    const server = http_1.default.createServer(app);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    const database = (0, database_1.getDatabase)();
    const logger = (0, logger_1.getLogger)();
    const socketRoutes = (0, socketRoutes_1.createSocketRoutes)(io);
    const socketMiddleware = (0, socketMiddleware_1.createSocketMiddleware)();
    // Setup middleware
    const setupMiddleware = () => {
        app.use((0, cors_1.default)({
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            credentials: true,
        }));
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
    };
    // Setup HTTP routes
    const setupRoutes = () => {
        // Health check endpoint
        app.get("/health", async (req, res) => {
            const dbHealth = await database.healthCheck();
            res.json({
                status: "OK",
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                database: dbHealth,
            });
        });
        // API info endpoint
        app.get("/api/info", (req, res) => {
            res.json({
                name: "Quiz App API",
                version: "1.0.0",
                description: "Real-time quiz application with Socket.IO (Functional Architecture)",
                architecture: "MVC with Functional Programming",
            });
        });
        // 404 handler
        app.use("*", (req, res) => {
            res.status(404).json({
                error: "Route not found",
                path: req.originalUrl,
            });
        });
    };
    // Setup socket middleware
    const setupSocketMiddleware = () => {
        io.use(socketMiddleware.auth);
        io.use(socketMiddleware.rateLimit);
        io.use(socketMiddleware.validation);
    };
    // Setup socket routes
    const setupSocketRoutes = () => {
        io.on("connection", (socket) => {
            logger.info(`New socket connection: ${socket.id}`);
            socketRoutes.setupRoutes(socket);
        });
    };
    // Start server
    const start = async () => {
        try {
            // Initialize database connection
            await database.connect();
            // Setup all middleware and routes
            setupMiddleware();
            setupRoutes();
            setupSocketMiddleware();
            setupSocketRoutes();
            const PORT = process.env.PORT || 5000;
            server.listen(PORT, () => {
                logger.info(`🚀 Server running on port ${PORT}`);
                logger.info(`📡 Socket.IO server ready for connections`);
                logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
                logger.info(`🏗️  Architecture: MVC with Functional Programming`);
            });
            // Graceful shutdown
            process.on("SIGTERM", shutdown);
            process.on("SIGINT", shutdown);
        }
        catch (error) {
            logger.error("Failed to start server", { error });
            process.exit(1);
        }
    };
    // Graceful shutdown
    const shutdown = async () => {
        logger.info("🛑 Shutting down server...");
        try {
            await database.disconnect();
            server.close(() => {
                logger.info("✅ Server shut down successfully");
                process.exit(0);
            });
        }
        catch (error) {
            logger.error("Error during shutdown", { error });
            process.exit(1);
        }
    };
    return { start, shutdown };
};
// Start the server
const server = createQuizServer();
server.start().catch((error) => {
    console.error("Failed to start application:", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map