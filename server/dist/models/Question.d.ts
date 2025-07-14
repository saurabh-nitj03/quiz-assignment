import type { Question } from "../types";
export declare class QuestionModel {
    private static instance;
    private questions;
    private constructor();
    static getInstance(): QuestionModel;
    create(questionData: Omit<Question, "id" | "createdAt">): Question;
    findById(id: string): Question | undefined;
    getAll(): Question[];
    delete(id: string): boolean;
    clear(): void;
    private generateId;
}
//# sourceMappingURL=Question.d.ts.map