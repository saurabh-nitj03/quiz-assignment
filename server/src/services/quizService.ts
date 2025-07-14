import { getQuestionModel } from "../models/questionModel"
import { getUserModel } from "../models/userModel"
import { getQuizSessionModel } from "../models/quizSessionModel"
import type { Question, UserAnswer, AnswerRevealedEvent, QuestionModel, UserModel, QuizSessionModel } from "../types"

// Functional service using dependency injection
export const createQuizService = (
  questionModel: QuestionModel,
  userModel: UserModel,
  quizSession: QuizSessionModel,
) => {
  const createQuestion = (questionData: Omit<Question, "id" | "createdAt">): Question => {
    const question = questionModel.create(questionData)
    quizSession.setCurrentQuestion(question)
    return question
  }

  const getCurrentQuestion = (): Question | null => {
    return quizSession.getCurrentQuestion()
  }

  const submitAnswer = (socketId: string, selectedOption: string): UserAnswer | null => {
    const user = quizSession.getUser(socketId)
    const currentQuestion = quizSession.getCurrentQuestion()

    if (!user || !currentQuestion || quizSession.isAnswerRevealed()) {
      return null
    }

    // Check if user already answered
    const existingAnswer = quizSession.getUserAnswer(user.id)
    if (existingAnswer) {
      return null
    }

    const isCorrect = selectedOption === currentQuestion.correctAnswer
    const userAnswer: UserAnswer = {
      userId: user.id,
      userName: user.name,
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect,
      submittedAt: new Date(),
    }

    quizSession.addUserAnswer(userAnswer)
    return userAnswer
  }

  const revealAnswer = (): AnswerRevealedEvent | null => {
    const currentQuestion = quizSession.getCurrentQuestion()
    if (!currentQuestion) {
      return null
    }

    quizSession.setAnswerRevealed(true)
    const userAnswers = quizSession.getAllUserAnswers()
    const statistics = quizSession.getAnswerStatistics()

    return {
      correctAnswer: currentQuestion.correctAnswer,
      userAnswers,
      statistics,
    }
  }

  const addUser = (socketId: string, name: string) => {
    const user = userModel.create({ name, socketId })
    quizSession.addUser(user)
    return user
  }

  const removeUser = (socketId: string): void => {
    userModel.delete(socketId)
    quizSession.removeUser(socketId)
  }

  const getUser = (socketId: string) => {
    return quizSession.getUser(socketId)
  }

  const getAllUsers = () => {
    return quizSession.getAllUsers()
  }

  const getAnswerStatistics = () => {
    return quizSession.getAnswerStatistics()
  }

  return {
    createQuestion,
    getCurrentQuestion,
    submitAnswer,
    revealAnswer,
    addUser,
    removeUser,
    getUser,
    getAllUsers,
    getAnswerStatistics,
  }
}

// Factory function to create service with dependencies
export const createQuizServiceWithDependencies = () => {
  const questionModel = getQuestionModel()
  const userModel = getUserModel()
  const quizSession = getQuizSessionModel()

  return createQuizService(questionModel, userModel, quizSession)
}

// Singleton instance
let quizServiceInstance: ReturnType<typeof createQuizService> | null = null

export const getQuizService = () => {
  if (!quizServiceInstance) {
    quizServiceInstance = createQuizServiceWithDependencies()
  }
  return quizServiceInstance
}
