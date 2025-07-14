"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionModel = void 0;
class QuestionModel {
    constructor() {
        this.questions = new Map();
    }
    static getInstance() {
        if (!QuestionModel.instance) {
            QuestionModel.instance = new QuestionModel();
        }
        return QuestionModel.instance;
    }
    create(questionData) {
        const question = {
            id: this.generateId(),
            ...questionData,
            createdAt: new Date(),
        };
        this.questions.set(question.id, question);
        return question;
    }
    findById(id) {
        return this.questions.get(id);
    }
    getAll() {
        return Array.from(this.questions.values());
    }
    delete(id) {
        return this.questions.delete(id);
    }
    clear() {
        this.questions.clear();
    }
    generateId() {
        return `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.QuestionModel = QuestionModel;
//# sourceMappingURL=Question.js.map