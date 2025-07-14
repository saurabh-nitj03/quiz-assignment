import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import { createSocketRoutes } from "./routes/socketRoutes"
import { createSocketMiddleware } from "./middleware/socketMiddleware"
import { getDatabase } from "./config/database"
import { getLogger } from "./utils/logger"

// Functional server setup
const createQuizServer = () => {
  const app = express()
  const server = http.createServer(app)
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  })

  const database = getDatabase()
  const logger = getLogger()
  const socketRoutes = createSocketRoutes(io)
  const socketMiddleware = createSocketMiddleware()

  // Setup middleware
  const setupMiddleware = (): void => {
    app.use(
      cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
      }),
    )
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
  }

  // Setup HTTP routes
  const setupRoutes = (): void => {
    // Health check endpoint
    app.get("/health", async (req, res) => {
      const dbHealth = await database.healthCheck()
      res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbHealth,
      })
    })

    // API info endpoint
    app.get("/api/info", (req, res) => {
      res.json({
        name: "Quiz App API",
        version: "1.0.0",
        description: "Real-time quiz application with Socket.IO (Functional Architecture)",
        architecture: "MVC with Functional Programming",
      })
    })

    // 404 handler
    app.use("*", (req, res) => {
      res.status(404).json({
        error: "Route not found",
        path: req.originalUrl,
      })
    })
  }

  // Setup socket middleware
  const setupSocketMiddleware = (): void => {
    io.use(socketMiddleware.auth)
    io.use(socketMiddleware.rateLimit)
    io.use(socketMiddleware.validation)
  }

  // Setup socket routes
  const setupSocketRoutes = (): void => {
    io.on("connection", (socket) => {
      logger.info(`New socket connection: ${socket.id}`)
      socketRoutes.setupRoutes(socket)
    })
  }

  // Start server
  const start = async (): Promise<void> => {
    try {
      // Initialize database connection
      await database.connect()

      // Setup all middleware and routes
      setupMiddleware()
      setupRoutes()
      setupSocketMiddleware()
      setupSocketRoutes()

      const PORT = process.env.PORT || 5000

      server.listen(PORT, () => {
        logger.info(`🚀 Server running on port ${PORT}`)
        logger.info(`📡 Socket.IO server ready for connections`)
        logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
        logger.info(`🏗️  Architecture: MVC with Functional Programming`)
      })

      // Graceful shutdown
      process.on("SIGTERM", shutdown)
      process.on("SIGINT", shutdown)
    } catch (error) {
      logger.error("Failed to start server", { error })
      process.exit(1)
    }
  }

  // Graceful shutdown
  const shutdown = async (): Promise<void> => {
    logger.info("🛑 Shutting down server...")

    try {
      await database.disconnect()
      server.close(() => {
        logger.info("✅ Server shut down successfully")
        process.exit(0)
      })
    } catch (error) {
      logger.error("Error during shutdown", { error })
      process.exit(1)
    }
  }

  return { start, shutdown }
}

// Start the server
const server = createQuizServer()
server.start().catch((error) => {
  console.error("Failed to start application:", error)
  process.exit(1)
})
