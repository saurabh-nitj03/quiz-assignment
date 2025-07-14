"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestionModel = exports.createQuestionModel = void 0;
// Create a functional model using closure
const createQuestionModel = () => {
    const questions = new Map();
    const generateId = () => {
        return `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };
    const create = (questionData) => {
        const question = {
            id: generateId(),
            ...questionData,
            createdAt: new Date(),
        };
        questions.set(question.id, question);
        return question;
    };
    const findById = (id) => {
        return questions.get(id);
    };
    const getAll = () => {
        return Array.from(questions.values());
    };
    const deleteQuestion = (id) => {
        return questions.delete(id);
    };
    const clear = () => {
        questions.clear();
    };
    return {
        create,
        findById,
        getAll,
        delete: deleteQuestion,
        clear,
    };
};
exports.createQuestionModel = createQuestionModel;
// Singleton instance using functional approach
let questionModelInstance = null;
const getQuestionModel = () => {
    if (!questionModelInstance) {
        questionModelInstance = (0, exports.createQuestionModel)();
    }
    return questionModelInstance;
};
exports.getQuestionModel = getQuestionModel;
//# sourceMappingURL=questionModel.js.map