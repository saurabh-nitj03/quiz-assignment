import type { Socket, Server } from "socket.io"
import { getQuizService } from "../services/quizService"
import type { Question, UserJoinData, SubmitAnswerData, UserAnsweredEvent } from "../types"

// Functional controller using higher-order functions
export const createQuizController = (io: Server) => {
  const quizService = getQuizService()

  const handleAdminJoin = (socket: Socket) => {
    socket.join("admin")
    console.log(`Admin joined: ${socket.id}`)

    // Send current session status to admin
    const currentQuestion = quizService.getCurrentQuestion()
    const statistics = quizService.getAnswerStatistics()

    socket.emit("admin-status", {
      currentQuestion,
      statistics,
      connectedUsers: quizService.getAllUsers().length,
    })
  }

  const handleAddQuestion = (socket: Socket, questionData: Omit<Question, "id" | "createdAt">) => {
    try {
      const question = quizService.createQuestion(questionData)

      // Send question to all users
      io.emit("new-question", question)

      // Confirm to admin
      socket.emit("question-created", {
        success: true,
        data: question,
      })

      console.log(`New question created: ${question.id}`)
    } catch (error) {
      socket.emit("question-created", {
        success: false,
        message: "Failed to create question",
      })
    }
  }

  const handleRevealAnswer = (socket: Socket) => {
    try {
      const result = quizService.revealAnswer()

      if (result) {
        // Send answer reveal to all users
        io.emit("answer-revealed", result)

        // Confirm to admin
        socket.emit("answer-reveal-success", {
          success: true,
          data: result,
        })

        console.log("Answer revealed to all users")
      } else {
        socket.emit("answer-reveal-success", {
          success: false,
          message: "No active question to reveal",
        })
      }
    } catch (error) {
      socket.emit("answer-reveal-success", {
        success: false,
        message: "Failed to reveal answer",
      })
    }
  }

  const handleUserJoin = (socket: Socket, userData: UserJoinData) => {
    try {
      const user = quizService.addUser(socket.id, userData.name)
      socket.join("users")

      // Store user data in socket for easy access
      ;(socket as any).userData = user

      // Send current question if exists and not revealed
      const currentQuestion = quizService.getCurrentQuestion()
      if (currentQuestion && !quizService.getAnswerStatistics()) {
        socket.emit("new-question", currentQuestion)
      }

      // Notify admin about new user
      io.to("admin").emit("user-joined", {
        user,
        totalUsers: quizService.getAllUsers().length,
      })

      console.log(`User joined: ${user.name} (${socket.id})`)
    } catch (error) {
      socket.emit("join-error", {
        success: false,
        message: "Failed to join quiz",
      })
    }
  }

  const handleSubmitAnswer = (socket: Socket, answerData: SubmitAnswerData) => {
    try {
      const userAnswer = quizService.submitAnswer(socket.id, answerData.selectedOption)

      if (userAnswer) {
        // Notify admin about new answer
        const statistics = quizService.getAnswerStatistics()
        const userAnsweredEvent: UserAnsweredEvent = {
          userId: userAnswer.userId,
          userName: userAnswer.userName,
          answer: userAnswer.selectedOption,
          totalAnswers: statistics.totalAnswers,
        }

        io.to("admin").emit("user-answered", userAnsweredEvent)

        // Confirm submission to user
        socket.emit("answer-submitted", {
          success: true,
          message: "Answer submitted successfully",
        })

        console.log(`Answer submitted by ${userAnswer.userName}: ${userAnswer.selectedOption}`)
      } else {
        socket.emit("answer-submitted", {
          success: false,
          message: "Unable to submit answer",
        })
      }
    } catch (error) {
      socket.emit("answer-submitted", {
        success: false,
        message: "Failed to submit answer",
      })
    }
  }

  const handleDisconnect = (socket: Socket) => {
    const user = quizService.getUser(socket.id)

    if (user) {
      quizService.removeUser(socket.id)

      // Notify admin about user leaving
      io.to("admin").emit("user-left", {
        user,
        totalUsers: quizService.getAllUsers().length,
      })

      console.log(`User disconnected: ${user.name} (${socket.id})`)
    } else {
      console.log(`Socket disconnected: ${socket.id}`)
    }
  }

  return {
    handleAdminJoin,
    handleAddQuestion,
    handleRevealAnswer,
    handleUserJoin,
    handleSubmitAnswer,
    handleDisconnect,
  }
}
