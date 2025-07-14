"use client"

import { useState, useEffect } from "react"
import { io, type Socket } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle, XCircle, User } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
}

interface AnswerResult {
  correctAnswer: string
  userAnswers: Record<string, any>
}

export default function UserPage() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [userName, setUserName] = useState("")
  const [isJoined, setIsJoined] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedOption, setSelectedOption] = useState("")
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const newSocket = io("http://localhost:5000")
    setSocket(newSocket)

    newSocket.on("connect", () => {
      setIsConnected(true)
    })

    newSocket.on("disconnect", () => {
      setIsConnected(false)
    })

    newSocket.on("new-question", (question: Question) => {
      setCurrentQuestion(question)
      setSelectedOption("")
      setHasSubmitted(false)
      setAnswerResult(null)
    })

    newSocket.on("answer-revealed", (result: AnswerResult) => {
      setAnswerResult(result)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const handleJoin = () => {
    if (userName.trim() && socket) {
      socket.emit("user-join", { name: userName })
      setIsJoined(true)
    }
  }

  const handleSubmitAnswer = () => {
    if (selectedOption && socket && currentQuestion) {
      socket.emit("submit-answer", { selectedOption })
      setHasSubmitted(true)
    }
  }

  const isCorrectAnswer = (option: string) => {
    return answerResult && option === answerResult.correctAnswer
  }

  const isUserAnswer = (option: string) => {
    return selectedOption === option
  }

  if (!isJoined) {
    return (
      <div className="container mx-auto p-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Join Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <div>
              <Label htmlFor="username">Your Name</Label>
              <Input
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                onKeyPress={(e) => e.key === "Enter" && handleJoin()}
              />
            </div>
            <Button onClick={handleJoin} disabled={!userName.trim() || !isConnected} className="w-full">
              <User className="w-4 h-4 mr-2" />
              Join Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Quiz - Welcome {userName}!</h1>
        <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Connected" : "Disconnected"}</Badge>
      </div>

      {currentQuestion ? (
        <Card>
          <CardHeader>
            <CardTitle>{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              disabled={hasSubmitted || !!answerResult}
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                    answerResult
                      ? isCorrectAnswer(option)
                        ? "bg-green-50 border-green-200"
                        : isUserAnswer(option) && !isCorrectAnswer(option)
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50"
                      : selectedOption === option
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50"
                  }`}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                  {answerResult && (
                    <>
                      {isCorrectAnswer(option) && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {isUserAnswer(option) && !isCorrectAnswer(option) && <XCircle className="w-5 h-5 text-red-600" />}
                    </>
                  )}
                </div>
              ))}
            </RadioGroup>

            {!hasSubmitted && !answerResult && (
              <Button onClick={handleSubmitAnswer} disabled={!selectedOption} className="w-full">
                Submit Answer
              </Button>
            )}

            {hasSubmitted && !answerResult && (
              <div className="text-center text-muted-foreground">Answer submitted! Waiting for results...</div>
            )}

            {answerResult && (
              <div className="text-center">
                <Badge variant={isCorrectAnswer(selectedOption) ? "default" : "destructive"} className="text-lg p-2">
                  {isCorrectAnswer(selectedOption) ? "Correct!" : "Incorrect"}
                </Badge>
                <p className="mt-2 text-sm text-muted-foreground">Correct answer: {answerResult.correctAnswer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Waiting for the next question...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
