import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Real-time Quiz App</h1>
        <p className="text-xl text-muted-foreground">
          Interactive quiz platform with live admin controls and real-time user participation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <UserCheck className="w-16 h-16 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Create questions, monitor user responses, and reveal answers in real-time
            </p>
            <ul className="text-sm text-left space-y-2">
              <li>• Add questions with 4 multiple choice options</li>
              <li>• Monitor live user responses</li>
              <li>• Control when to reveal correct answers</li>
              <li>• Real-time user activity tracking</li>
            </ul>
            <Link href="/admin">
              <Button size="lg" className="w-full">
                Access Admin Panel
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl">User Quiz</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">Join the quiz, answer questions, and see results instantly</p>
            <ul className="text-sm text-left space-y-2">
              <li>• Real-time question delivery</li>
              <li>• Interactive multiple choice interface</li>
              <li>• Instant feedback on answers</li>
              <li>• Live result reveals</li>
            </ul>
            <Link href="/user">
              <Button size="lg" variant="outline" className="w-full bg-transparent">
                Join as User
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <Card>
          <CardHeader>
            <CardTitle>How it Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                  1
                </div>
                <p>
                  <strong>Admin creates question</strong>
                  <br />
                  Add question with 4 options and mark correct answer
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                  2
                </div>
                <p>
                  <strong>Users answer</strong>
                  <br />
                  Question appears instantly on all user screens
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                  3
                </div>
                <p>
                  <strong>Results revealed</strong>
                  <br />
                  Admin reveals answers and users see results
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
