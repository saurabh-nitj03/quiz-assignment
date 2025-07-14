import type { Question, UserAnswer, QuizSession, User } from "../types"

export class QuizSessionModel {
  private static instance: QuizSessionModel
  private session: QuizSession

  private constructor() {
    this.session = {
      currentQuestion: null,
      userAnswers: new Map(),
      isAnswerRevealed: false,
      users: new Map(),
    }
  }

  public static getInstance(): QuizSessionModel {
    if (!QuizSessionModel.instance) {
      QuizSessionModel.instance = new QuizSessionModel()
    }
    return QuizSessionModel.instance
  }

  public setCurrentQuestion(question: Question): void {
    this.session.currentQuestion = question
    this.session.userAnswers.clear()
    this.session.isAnswerRevealed = false
  }

  public getCurrentQuestion(): Question | null {
    return this.session.currentQuestion
  }

  public addUserAnswer(answer: UserAnswer): void {
    this.session.userAnswers.set(answer.userId, answer)
  }

  public getUserAnswer(userId: string): UserAnswer | undefined {
    return this.session.userAnswers.get(userId)
  }

  public getAllUserAnswers(): UserAnswer[] {
    return Array.from(this.session.userAnswers.values())
  }

  public setAnswerRevealed(revealed: boolean): void {
    this.session.isAnswerRevealed = revealed
  }

  public isAnswerRevealed(): boolean {
    return this.session.isAnswerRevealed
  }

  public addUser(user: User): void {
    this.session.users.set(user.socketId, user)
  }

  public removeUser(socketId: string): void {
    this.session.users.delete(socketId)
    this.session.userAnswers.delete(socketId)
  }

  public getUser(socketId: string): User | undefined {
    return this.session.users.get(socketId)
  }

  public getAllUsers(): User[] {
    return Array.from(this.session.users.values())
  }

  public getAnswerStatistics() {
    const answers = this.getAllUserAnswers()
    const correctAnswers = answers.filter((answer) => answer.isCorrect).length

    return {
      totalUsers: this.getAllUsers().length,
      totalAnswers: answers.length,
      correctAnswers,
      incorrectAnswers: answers.length - correctAnswers,
    }
  }

  public reset(): void {
    this.session.currentQuestion = null
    this.session.userAnswers.clear()
    this.session.isAnswerRevealed = false
    this.session.users.clear()
  }
}
