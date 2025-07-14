import type { Question, UserAnswer, AnswerRevealedEvent, QuestionModel, UserModel, QuizSessionModel } from "../types";
export declare const createQuizService: (questionModel: QuestionModel, userModel: UserModel, quizSession: QuizSessionModel) => {
    createQuestion: (questionData: Omit<Question, "id" | "createdAt">) => Question;
    getCurrentQuestion: () => Question | null;
    submitAnswer: (socketId: string, selectedOption: string) => UserAnswer | null;
    revealAnswer: () => AnswerRevealedEvent | null;
    addUser: (socketId: string, name: string) => import("../types").User;
    removeUser: (socketId: string) => void;
    getUser: (socketId: string) => import("../types").User | undefined;
    getAllUsers: () => import("../types").User[];
    getAnswerStatistics: () => {
        totalUsers: number;
        totalAnswers: number;
        correctAnswers: number;
        incorrectAnswers: number;
    };
};
export declare const createQuizServiceWithDependencies: () => {
    createQuestion: (questionData: Omit<Question, "id" | "createdAt">) => Question;
    getCurrentQuestion: () => Question | null;
    submitAnswer: (socketId: string, selectedOption: string) => UserAnswer | null;
    revealAnswer: () => AnswerRevealedEvent | null;
    addUser: (socketId: string, name: string) => import("../types").User;
    removeUser: (socketId: string) => void;
    getUser: (socketId: string) => import("../types").User | undefined;
    getAllUsers: () => import("../types").User[];
    getAnswerStatistics: () => {
        totalUsers: number;
        totalAnswers: number;
        correctAnswers: number;
        incorrectAnswers: number;
    };
};
export declare const getQuizService: () => {
    createQuestion: (questionData: Omit<Question, "id" | "createdAt">) => Question;
    getCurrentQuestion: () => Question | null;
    submitAnswer: (socketId: string, selectedOption: string) => UserAnswer | null;
    revealAnswer: () => AnswerRevealedEvent | null;
    addUser: (socketId: string, name: string) => import("../types").User;
    removeUser: (socketId: string) => void;
    getUser: (socketId: string) => import("../types").User | undefined;
    getAllUsers: () => import("../types").User[];
    getAnswerStatistics: () => {
        totalUsers: number;
        totalAnswers: number;
        correctAnswers: number;
        incorrectAnswers: number;
    };
};
//# sourceMappingURL=quizService.d.ts.map