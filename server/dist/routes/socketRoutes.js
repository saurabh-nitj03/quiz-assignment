"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketRoutes = void 0;
const quizController_1 = require("../controllers/quizController");
// Functional route setup
const createSocketRoutes = (io) => {
    const quizController = (0, quizController_1.createQuizController)(io);
    const setupRoutes = (socket) => {
        // Admin routes
        socket.on("admin-join", () => quizController.handleAdminJoin(socket));
        socket.on("add-question", (data) => quizController.handleAddQuestion(socket, data));
        socket.on("reveal-answer", () => quizController.handleRevealAnswer(socket));
        // User routes
        socket.on("user-join", (data) => quizController.handleUserJoin(socket, data));
        socket.on("submit-answer", (data) => quizController.handleSubmitAnswer(socket, data));
        // Common routes
        socket.on("disconnect", () => quizController.handleDisconnect(socket));
    };
    return { setupRoutes };
};
exports.createSocketRoutes = createSocketRoutes;
//# sourceMappingURL=socketRoutes.js.map