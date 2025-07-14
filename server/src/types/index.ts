export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  createdAt: Date
}

export interface User {
  id: string
  name: string
  socketId: string
  joinedAt: Date
}

export interface UserAnswer {
  userId: string
  userName: string
  questionId: string
  selectedOption: string
  isCorrect: boolean
  submittedAt: Date
}

export interface QuizSession {
  currentQuestion: Question | null
  userAnswers: Map<string, UserAnswer>
  isAnswerRevealed: boolean
  users: Map<string, User>
}

export interface SocketResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

export interface AdminJoinData {
  adminId: string
}

export interface UserJoinData {
  name: string
}

export interface SubmitAnswerData {
  selectedOption: string
}

export interface UserAnsweredEvent {
  userId: string
  userName: string
  answer: string
  totalAnswers: number
}

export interface AnswerRevealedEvent {
  correctAnswer: string
  userAnswers: UserAnswer[]
  statistics: {
    totalUsers: number
    correctAnswers: number
    incorrectAnswers: number
  }
}

// Functional component types
export type QuestionModel = {
  create: (questionData: Omit<Question, "id" | "createdAt">) => Question
  findById: (id: string) => Question | undefined
  getAll: () => Question[]
  delete: (id: string) => boolean
  clear: () => void
}

export type UserModel = {
  create: (userData: Omit<User, "id" | "joinedAt">) => User
  findBySocketId: (socketId: string) => User | undefined
  findById: (id: string) => User | undefined
  getAll: () => User[]
  delete: (socketId: string) => boolean
  clear: () => void
}

export type QuizSessionModel = {
  setCurrentQuestion: (question: Question) => void
  getCurrentQuestion: () => Question | null
  addUserAnswer: (answer: UserAnswer) => void
  getUserAnswer: (userId: string) => UserAnswer | undefined
  getAllUserAnswers: () => UserAnswer[]
  setAnswerRevealed: (revealed: boolean) => void
  isAnswerRevealed: () => boolean
  addUser: (user: User) => void
  removeUser: (socketId: string) => void
  getUser: (socketId: string) => User | undefined
  getAllUsers: () => User[]
  getAnswerStatistics: () => {
    totalUsers: number
    totalAnswers: number
    correctAnswers: number
    incorrectAnswers: number
  }
  reset: () => void
}
