import type { Server, Socket } from "socket.io"
import { createQuizController } from "../controllers/quizController"

// Functional route setup
export const createSocketRoutes = (io: Server) => {
  const quizController = createQuizController(io)

  const setupRoutes = (socket: Socket): void => {
    // Admin routes
    socket.on("admin-join", () => quizController.handleAdminJoin(socket))
    socket.on("add-question", (data) => quizController.handleAddQuestion(socket, data))
    socket.on("reveal-answer", () => quizController.handleRevealAnswer(socket))

    // User routes
    socket.on("user-join", (data) => quizController.handleUserJoin(socket, data))
    socket.on("submit-answer", (data) => quizController.handleSubmitAnswer(socket, data))

    // Common routes
    socket.on("disconnect", () => quizController.handleDisconnect(socket))
  }

  return { setupRoutes }
}
