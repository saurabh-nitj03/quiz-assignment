"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSessionModel = void 0;
class QuizSessionModel {
    constructor() {
        this.session = {
            currentQuestion: null,
            userAnswers: new Map(),
            isAnswerRevealed: false,
            users: new Map(),
        };
    }
    static getInstance() {
        if (!QuizSessionModel.instance) {
            QuizSessionModel.instance = new QuizSessionModel();
        }
        return QuizSessionModel.instance;
    }
    setCurrentQuestion(question) {
        this.session.currentQuestion = question;
        this.session.userAnswers.clear();
        this.session.isAnswerRevealed = false;
    }
    getCurrentQuestion() {
        return this.session.currentQuestion;
    }
    addUserAnswer(answer) {
        this.session.userAnswers.set(answer.userId, answer);
    }
    getUserAnswer(userId) {
        return this.session.userAnswers.get(userId);
    }
    getAllUserAnswers() {
        return Array.from(this.session.userAnswers.values());
    }
    setAnswerRevealed(revealed) {
        this.session.isAnswerRevealed = revealed;
    }
    isAnswerRevealed() {
        return this.session.isAnswerRevealed;
    }
    addUser(user) {
        this.session.users.set(user.socketId, user);
    }
    removeUser(socketId) {
        this.session.users.delete(socketId);
        this.session.userAnswers.delete(socketId);
    }
    getUser(socketId) {
        return this.session.users.get(socketId);
    }
    getAllUsers() {
        return Array.from(this.session.users.values());
    }
    getAnswerStatistics() {
        const answers = this.getAllUserAnswers();
        const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
        return {
            totalUsers: this.getAllUsers().length,
            totalAnswers: answers.length,
            correctAnswers,
            incorrectAnswers: answers.length - correctAnswers,
        };
    }
    reset() {
        this.session.currentQuestion = null;
        this.session.userAnswers.clear();
        this.session.isAnswerRevealed = false;
        this.session.users.clear();
    }
}
exports.QuizSessionModel = QuizSessionModel;
//# sourceMappingURL=QuizSession.js.map