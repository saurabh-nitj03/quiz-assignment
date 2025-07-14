import type { Question, UserAnswer, User, QuizSessionModel } from "../types"

// Create a functional model using closure
export const createQuizSessionModel = (): QuizSessionModel => {
  let currentQuestion: Question | null = null
  const userAnswers = new Map<string, UserAnswer>()
  let isAnswerRevealedFlag = false
  const users = new Map<string, User>()

  const setCurrentQuestion = (question: Question): void => {
    currentQuestion = question
    userAnswers.clear()
    isAnswerRevealedFlag = false
  }

  const getCurrentQuestion = (): Question | null => {
    return currentQuestion
  }

  const addUserAnswer = (answer: UserAnswer): void => {
    userAnswers.set(answer.userId, answer)
  }

  const getUserAnswer = (userId: string): UserAnswer | undefined => {
    return userAnswers.get(userId)
  }

  const getAllUserAnswers = (): UserAnswer[] => {
    return Array.from(userAnswers.values())
  }

  const setAnswerRevealed = (revealed: boolean): void => {
    isAnswerRevealedFlag = revealed
  }

  const isAnswerRevealed = (): boolean => {
    return isAnswerRevealedFlag
  }

  const addUser = (user: User): void => {
    users.set(user.socketId, user)
  }

  const removeUser = (socketId: string): void => {
    users.delete(socketId)
    userAnswers.delete(socketId)
  }

  const getUser = (socketId: string): User | undefined => {
    return users.get(socketId)
  }

  const getAllUsers = (): User[] => {
    return Array.from(users.values())
  }

  const getAnswerStatistics = () => {
    const answers = getAllUserAnswers()
    const correctAnswers = answers.filter((answer) => answer.isCorrect).length

    return {
      totalUsers: getAllUsers().length,
      totalAnswers: answers.length,
      correctAnswers,
      incorrectAnswers: answers.length - correctAnswers,
    }
  }

  const reset = (): void => {
    currentQuestion = null
    userAnswers.clear()
    isAnswerRevealedFlag = false
    users.clear()
  }

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
  }
}

// Singleton instance using functional approach
let quizSessionModelInstance: QuizSessionModel | null = null

export const getQuizSessionModel = (): QuizSessionModel => {
  if (!quizSessionModelInstance) {
    quizSessionModelInstance = createQuizSessionModel()
  }
  return quizSessionModelInstance
}
