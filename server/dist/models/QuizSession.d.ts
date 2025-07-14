import type { Question, UserAnswer, User } from "../types";
export declare class QuizSessionModel {
    private static instance;
    private session;
    private constructor();
    static getInstance(): QuizSessionModel;
    setCurrentQuestion(question: Question): void;
    getCurrentQuestion(): Question | null;
    addUserAnswer(answer: UserAnswer): void;
    getUserAnswer(userId: string): UserAnswer | undefined;
    getAllUserAnswers(): UserAnswer[];
    setAnswerRevealed(revealed: boolean): void;
    isAnswerRevealed(): boolean;
    addUser(user: User): void;
    removeUser(socketId: string): void;
    getUser(socketId: string): User | undefined;
    getAllUsers(): User[];
    getAnswerStatistics(): {
        totalUsers: number;
        totalAnswers: number;
        correctAnswers: number;
        incorrectAnswers: number;
    };
    reset(): void;
}
//# sourceMappingURL=QuizSession.d.ts.map