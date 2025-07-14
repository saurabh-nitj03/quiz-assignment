# Real-time Quiz Application with Functional MVC Architecture

A Next.js quiz application with TypeScript backend using **Functional Programming** approach in MVC architecture and Socket.IO for real-time communication.

## Architecture Overview

### Backend (TypeScript + Functional MVC)
- **Models**: Functional data structures using closures and higher-order functions
- **Controllers**: Pure functions that handle socket events
- **Services**: Functional business logic with dependency injection
- **Routes**: Functional socket event routing
- **Middleware**: Higher-order functions for cross-cutting concerns
- **Utils**: Functional utilities and helpers

### Key Functional Programming Concepts Used
- **Higher-Order Functions**: Functions that return other functions
- **Closures**: Private state management without classes
- **Pure Functions**: Predictable functions without side effects
- **Function Composition**: Building complex functionality from simple functions
- **Dependency Injection**: Functional approach to managing dependencies

## Project Structure

\`\`\`
├── server/                     # Backend (TypeScript + Functional MVC)
│   ├── src/
│   │   ├── controllers/        # Functional controllers
│   │   │   └── quizController.ts
│   │   ├── models/            # Functional models with closures
│   │   │   ├── questionModel.ts
│   │   │   ├── userModel.ts
│   │   │   └── quizSessionModel.ts
│   │   ├── services/          # Functional business logic
│   │   │   └── quizService.ts
│   │   ├── routes/            # Functional socket routes
│   │   │   └── socketRoutes.ts
│   │   ├── middleware/        # Higher-order function middleware
│   │   │   └── socketMiddleware.ts
│   │   ├── config/            # Functional configuration
│   │   │   └── database.ts
│   │   ├── utils/             # Functional utilities
│   │   │   └── logger.ts
│   │   ├── types/             # TypeScript types
│   │   │   └── index.ts
│   │   └── server.ts          # Functional server setup
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── app/                       # Frontend (Next.js)
│   ├── admin/page.tsx         # Admin interface
│   ├── user/page.tsx          # User interface
│   └── page.tsx               # Home page
└── package.json
\`\`\`

## Functional Programming Features

### 1. **Functional Models with Closures**
\`\`\`typescript
export const createQuestionModel = (): QuestionModel => {
  const questions = new Map<string, Question>() // Private state

  const create = (questionData: Omit<Question, "id" | "createdAt">): Question => {
    // Pure function logic
  }

  return { create, findById, getAll, delete, clear } // Public interface
}
\`\`\`

### 2. **Higher-Order Function Controllers**
\`\`\`typescript
export const createQuizController = (io: Server) => {
  const quizService = getQuizService()

  const handleAdminJoin = (socket: Socket) => {
    // Controller logic
  }

  return { handleAdminJoin, handleAddQuestion, ... }
}
\`\`\`

### 3. **Functional Dependency Injection**
\`\`\`typescript
export const createQuizService = (
  questionModel: QuestionModel,
  userModel: UserModel,
  quizSession: QuizSessionModel,
) => {
  // Service logic with injected dependencies
  return { createQuestion, submitAnswer, ... }
}
\`\`\`

### 4. **Middleware as Higher-Order Functions**
\`\`\`typescript
export const createRateLimitMiddleware = () => {
  const connectionCounts = new Map<string, number>()
  
  return (socket: Socket, next: (err?: ExtendedError) => void) => {
    // Middleware logic
  }
}
\`\`\`

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- TypeScript knowledge

### Backend Setup

1. **Navigate to server directory:**
   \`\`\`bash
   cd server
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Create environment file:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

### Frontend Setup

1. **In root directory, install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start Next.js development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

## Running the Application

### Development Mode

**Terminal 1 (Backend):**
\`\`\`bash
cd server
npm run dev
\`\`\`

**Terminal 2 (Frontend):**
\`\`\`bash
npm run dev
\`\`\`

## Benefits of Functional Approach

### 1. **Immutability**
- State changes are controlled and predictable
- Easier to debug and test

### 2. **Pure Functions**
- No side effects make functions predictable
- Easy to unit test

### 3. **Composability**
- Small functions can be combined to create complex behavior
- Reusable components

### 4. **Memory Efficiency**
- Closures provide private state without class overhead
- Better garbage collection

### 5. **Type Safety**
- Full TypeScript integration with functional patterns
- Better IDE support and error detection

## API Documentation

### Socket Events

#### Admin Events
- `admin-join`: Admin joins the session
- `add-question`: Create new question
- `reveal-answer`: Reveal correct answer

#### User Events
- `user-join`: User joins with name
- `submit-answer`: Submit answer to question

#### Broadcast Events
- `new-question`: New question sent to users
- `answer-revealed`: Answer revealed with statistics
- `user-answered`: User response notification to admin

## Environment Variables

Create a `.env` file in the server directory:

\`\`\`env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quiz_app
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-jwt-secret-key
CORS_ORIGIN=http://localhost:3000
\`\`\`

## Testing Functional Components

### Unit Testing Example
\`\`\`typescript
import { createQuestionModel } from '../models/questionModel'

describe('Question Model', () => {
  test('should create question with generated ID', () => {
    const model = createQuestionModel()
    const question = model.create({
      question: 'Test question?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 'A'
    })
    
    expect(question.id).toBeDefined()
    expect(question.question).toBe('Test question?')
  })
})
\`\`\`

## Future Enhancements

- Database integration with functional query builders
- Functional reactive programming with RxJS
- Event sourcing with functional event handlers
- Microservices with functional composition
- Advanced functional patterns (Monads, Functors)

## Technologies Used

- **Backend**: Node.js, Express, Socket.IO, TypeScript
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Architecture**: Functional MVC with Higher-Order Functions
- **Patterns**: Closures, Pure Functions, Function Composition
- **Development**: ts-node-dev for hot reloading
