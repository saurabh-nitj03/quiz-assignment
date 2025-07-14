import type { Question, QuestionModel } from "../types"

// Create a functional model using closure
export const createQuestionModel = (): QuestionModel => {
  const questions = new Map<string, Question>()

  const generateId = (): string => {
    return `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const create = (questionData: Omit<Question, "id" | "createdAt">): Question => {
    const question: Question = {
      id: generateId(),
      ...questionData,
      createdAt: new Date(),
    }

    questions.set(question.id, question)
    return question
  }

  const findById = (id: string): Question | undefined => {
    return questions.get(id)
  }

  const getAll = (): Question[] => {
    return Array.from(questions.values())
  }

  const deleteQuestion = (id: string): boolean => {
    return questions.delete(id)
  }

  const clear = (): void => {
    questions.clear()
  }

  return {
    create,
    findById,
    getAll,
    delete: deleteQuestion,
    clear,
  }
}

// Singleton instance using functional approach
let questionModelInstance: QuestionModel | null = null

export const getQuestionModel = (): QuestionModel => {
  if (!questionModelInstance) {
    questionModelInstance = createQuestionModel()
  }
  return questionModelInstance
}
