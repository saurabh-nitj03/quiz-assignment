"use client"

import { useState, useEffect } from "react"
import { io, type Socket } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Eye, Send, CheckCircle, XCircle } from "lucide-react"

interface UserAnswer {
  userId: string
  userName: string
  answer: string
  totalAnswers: number
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
}

interface AdminStatus {
  currentQuestion: Question | null
  statistics: {
    totalUsers: number
    totalAnswers: number
    correctAnswers: number
    incorrectAnswers: number
  }
  connectedUsers: number
}

export default function AdminPage() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const newSocket = io("http://localhost:5000")
    setSocket(newSocket)

    newSocket.on("connect", () => {
      setIsConnected(true)
      newSocket.emit("admin-join")
    })

    newSocket.on("disconnect", () => {
      setIsConnected(false)
    })

    newSocket.on("admin-status", (status: AdminStatus) => {
      setAdminStatus(status)
      setCurrentQuestion(status.currentQuestion)
    })

    newSocket.on("question-created", (response: { success: boolean; data?: Question }) => {
      setIsSubmitting(false)
      if (response.success && response.data) {
        setCurrentQuestion(response.data)
        setUserAnswers([])
      }
    })

    newSocket.on("user-answered", (answerData: UserAnswer) => {
      setUserAnswers((prev) => {
        const existing = prev.find((a) => a.userId === answerData.userId)
        if (existing) {
          return prev.map((a) => (a.userId === answerData.userId ? answerData : a))
        }
        return [...prev, answerData]
      })
    })

    newSocket.on("user-joined", (data: { user: any; totalUsers: number }) => {
      console.log("User joined:", data.user.name)
    })

    newSocket.on("user-left", (data: { user: any; totalUsers: number }) => {
      console.log("User left:", data.user.name)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmitQuestion = () => {
    if (question && options.every((opt) => opt.trim()) && correctAnswer) {
      setIsSubmitting(true)
      const questionData = {
        question,
        options,
        correctAnswer,
      }

      socket?.emit("add-question", questionData)

      // Reset form
      setQuestion("")
      setOptions(["", "", "", ""])
      setCorrectAnswer("")
    }
  }

  const handleRevealAnswer = () => {
    socket?.emit("reveal-answer")
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Connected" : "Disconnected"}</Badge>
          <Badge variant="outline">
            <Users className="w-4 h-4 mr-1" />
            {userAnswers.length} Users Answered
          </Badge>
          {adminStatus && <Badge variant="secondary">{adminStatus.connectedUsers} Connected Users</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question"
                disabled={isSubmitting}
              />
            </div>

            {options.map((option, index) => (
              <div key={index}>
                <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
                <Input
                  id={`option-${index}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Enter option ${index + 1}`}
                  disabled={isSubmitting}
                />
              </div>
            ))}

            <div>
              <Label htmlFor="correct">Correct Answer</Label>
              <select
                id="correct"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={isSubmitting}
              >
                <option value="">Select correct answer</option>
                {options.map((option, index) => (
                  <option key={index} value={option} disabled={!option.trim()}>
                    {option || `Option ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleSubmitQuestion}
              disabled={!question || !options.every((opt) => opt.trim()) || !correctAnswer || isSubmitting}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Sending..." : "Send Question to Users"}
            </Button>
          </CardContent>
        </Card>

        {/* Current Question & Answers */}
        <Card>
          <CardHeader>
            <CardTitle>Current Question Status</CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuestion ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Active Question:</h3>
                  <p className="text-sm text-muted-foreground">{currentQuestion.question}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Options:</h4>
                  <div className="space-y-1">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {option === currentQuestion.correctAnswer ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">User Responses ({userAnswers.length}):</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {userAnswers.map((answer, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">{answer.userName}</span>
                        <Badge variant={answer.answer === currentQuestion.correctAnswer ? "default" : "destructive"}>
                          {answer.answer}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleRevealAnswer}
                  variant="secondary"
                  className="w-full"
                  disabled={userAnswers.length === 0}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Reveal Answer to Users
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">No active question</p>
            )}
          </CardContent>
        </Card>
      </div>

      {adminStatus && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Session Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{adminStatus.connectedUsers}</div>
                <div className="text-sm text-muted-foreground">Connected Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{adminStatus.statistics.totalAnswers}</div>
                <div className="text-sm text-muted-foreground">Total Answers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{adminStatus.statistics.correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{adminStatus.statistics.incorrectAnswers}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
