const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

// In-memory storage (use database in production)
let currentQuestion = null
let userAnswers = {}
let isAnswerRevealed = false

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Admin events
  socket.on("admin-join", () => {
    socket.join("admin")
    console.log("Admin joined")
  })

  socket.on("add-question", (questionData) => {
    currentQuestion = {
      ...questionData,
      id: Date.now(),
    }
    userAnswers = {}
    isAnswerRevealed = false

    // Send question to all users
    io.emit("new-question", currentQuestion)
    console.log("New question added:", currentQuestion)
  })

  socket.on("reveal-answer", () => {
    if (currentQuestion) {
      isAnswerRevealed = true
      io.emit("answer-revealed", {
        correctAnswer: currentQuestion.correctAnswer,
        userAnswers: userAnswers,
      })
    }
  })

  // User events
  socket.on("user-join", (userData) => {
    socket.join("users")
    socket.userData = userData

    // Send current question if exists
    if (currentQuestion && !isAnswerRevealed) {
      socket.emit("new-question", currentQuestion)
    }

    console.log("User joined:", userData)
  })

  socket.on("submit-answer", (answerData) => {
    if (currentQuestion && !isAnswerRevealed) {
      userAnswers[socket.id] = {
        userId: socket.userData?.name || socket.id,
        answer: answerData.selectedOption,
        timestamp: new Date(),
      }

      // Notify admin about new answer
      io.to("admin").emit("user-answered", {
        userId: socket.userData?.name || socket.id,
        answer: answerData.selectedOption,
        totalAnswers: Object.keys(userAnswers).length,
      })

      console.log("Answer submitted:", answerData)
    }
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
    delete userAnswers[socket.id]
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
