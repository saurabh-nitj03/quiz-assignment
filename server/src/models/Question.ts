import type { Question } from "../types"

export class QuestionModel {
  private static instance: QuestionModel
  private questions: Map<string, Question> = new Map()

  private constructor() {}

  public static getInstance(): QuestionModel {
    if (!QuestionModel.instance) {
      QuestionModel.instance = new QuestionModel()
    }
    return QuestionModel.instance
  }

  public create(questionData: Omit<Question, "id" | "createdAt">): Question {
    const question: Question = {
      id: this.generateId(),
      ...questionData,
      createdAt: new Date(),
    }

    this.questions.set(question.id, question)
    return question
  }

  public findById(id: string): Question | undefined {
    return this.questions.get(id)
  }

  public getAll(): Question[] {
    return Array.from(this.questions.values())
  }

  public delete(id: string): boolean {
    return this.questions.delete(id)
  }

  public clear(): void {
    this.questions.clear()
  }

  private generateId(): string {
    return `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
