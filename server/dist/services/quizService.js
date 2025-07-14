"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizService = exports.createQuizServiceWithDependencies = exports.createQuizService = void 0;
const questionModel_1 = require("../models/questionModel");
const userModel_1 = require("../models/userModel");
const quizSessionModel_1 = require("../models/quizSessionModel");
// Functional service using dependency injection
const createQuizService = (questionModel, userModel, quizSession) => {
    const createQuestion = (questionData) => {
        const question = questionModel.create(questionData);
        quizSession.setCurrentQuestion(question);
        return question;
    };
    const getCurrentQuestion = () => {
        return quizSession.getCurrentQuestion();
    };
    const submitAnswer = (socketId, selectedOption) => {
        const user = quizSession.getUser(socketId);
        const currentQuestion = quizSession.getCurrentQuestion();
        if (!user || !currentQuestion || quizSession.isAnswerRevealed()) {
            return null;
        }
        // Check if user already answered
        const existingAnswer = quizSession.getUserAnswer(user.id);
        if (existingAnswer) {
            return null;
        }
        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        const userAnswer = {
            userId: user.id,
            userName: user.name,
            questionId: currentQuestion.id,
            selectedOption,
            isCorrect,
            submittedAt: new Date(),
        };
        quizSession.addUserAnswer(userAnswer);
        return userAnswer;
    };
    const revealAnswer = () => {
        const currentQuestion = quizSession.getCurrentQuestion();
        if (!currentQuestion) {
            return null;
        }
        quizSession.setAnswerRevealed(true);
        const userAnswers = quizSession.getAllUserAnswers();
        const statistics = quizSession.getAnswerStatistics();
        return {
            correctAnswer: currentQuestion.correctAnswer,
            userAnswers,
            statistics,
        };
    };
    const addUser = (socketId, name) => {
        const user = userModel.create({ name, socketId });
        quizSession.addUser(user);
        return user;
    };
    const removeUser = (socketId) => {
        userModel.delete(socketId);
        quizSession.removeUser(socketId);
    };
    const getUser = (socketId) => {
        return quizSession.getUser(socketId);
    };
    const getAllUsers = () => {
        return quizSession.getAllUsers();
    };
    const getAnswerStatistics = () => {
        return quizSession.getAnswerStatistics();
    };
    return {
        createQuestion,
        getCurrentQuestion,
        submitAnswer,
        revealAnswer,
        addUser,
        removeUser,
        getUser,
        getAllUsers,
        getAnswerStatistics,
    };
};
exports.createQuizService = createQuizService;
// Factory function to create service with dependencies
const createQuizServiceWithDependencies = () => {
    const questionModel = (0, questionModel_1.getQuestionModel)();
    const userModel = (0, userModel_1.getUserModel)();
    const quizSession = (0, quizSessionModel_1.getQuizSessionModel)();
    return (0, exports.createQuizService)(questionModel, userModel, quizSession);
};
exports.createQuizServiceWithDependencies = createQuizServiceWithDependencies;
// Singleton instance
let quizServiceInstance = null;
const getQuizService = () => {
    if (!quizServiceInstance) {
        quizServiceInstance = (0, exports.createQuizServiceWithDependencies)();
    }
    return quizServiceInstance;
};
exports.getQuizService = getQuizService;
//# sourceMappingURL=quizService.js.map