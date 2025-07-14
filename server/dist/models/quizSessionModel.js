"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizSessionModel = exports.createQuizSessionModel = void 0;
// Create a functional model using closure
const createQuizSessionModel = () => {
    let currentQuestion = null;
    const userAnswers = new Map();
    let isAnswerRevealedFlag = false;
    const users = new Map();
    const setCurrentQuestion = (question) => {
        currentQuestion = question;
        userAnswers.clear();
        isAnswerRevealedFlag = false;
    };
    const getCurrentQuestion = () => {
        return currentQuestion;
    };
    const addUserAnswer = (answer) => {
        userAnswers.set(answer.userId, answer);
    };
    const getUserAnswer = (userId) => {
        return userAnswers.get(userId);
    };
    const getAllUserAnswers = () => {
        return Array.from(userAnswers.values());
    };
    const setAnswerRevealed = (revealed) => {
        isAnswerRevealedFlag = revealed;
    };
    const isAnswerRevealed = () => {
        return isAnswerRevealedFlag;
    };
    const addUser = (user) => {
        users.set(user.socketId, user);
    };
    const removeUser = (socketId) => {
        users.delete(socketId);
        userAnswers.delete(socketId);
    };
    const getUser = (socketId) => {
        return users.get(socketId);
    };
    const getAllUsers = () => {
        return Array.from(users.values());
    };
    const getAnswerStatistics = () => {
        const answers = getAllUserAnswers();
        const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
        return {
            totalUsers: getAllUsers().length,
            totalAnswers: answers.length,
            correctAnswers,
            incorrectAnswers: answers.length - correctAnswers,
        };
    };
    const reset = () => {
        currentQuestion = null;
        userAnswers.clear();
        isAnswerRevealedFlag = false;
        users.clear();
    };
    return {
        setCurrentQuestion,
        getCurrentQuestion,
        addUserAnswer,
        getUserAnswer,
        getAllUserAnswers,
        setAnswerRevealed,
        isAnswerRevealed,
        addUser,
        removeUser,
        getUser,
        getAllUsers,
        getAnswerStatistics,
        reset,
    };
};
exports.createQuizSessionModel = createQuizSessionModel;
// Singleton instance using functional approach
let quizSessionModelInstance = null;
const getQuizSessionModel = () => {
    if (!quizSessionModelInstance) {
        quizSessionModelInstance = (0, exports.createQuizSessionModel)();
    }
    return quizSessionModelInstance;
};
exports.getQuizSessionModel = getQuizSessionModel;
//# sourceMappingURL=quizSessionModel.js.map