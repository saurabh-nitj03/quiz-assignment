import type { Socket, Server } from "socket.io";
import type { Question, UserJoinData, SubmitAnswerData } from "../types";
export declare const createQuizController: (io: Server) => {
    handleAdminJoin: (socket: Socket) => void;
    handleAddQuestion: (socket: Socket, questionData: Omit<Question, "id" | "createdAt">) => void;
    handleRevealAnswer: (socket: Socket) => void;
    handleUserJoin: (socket: Socket, userData: UserJoinData) => void;
    handleSubmitAnswer: (socket: Socket, answerData: SubmitAnswerData) => void;
    handleDisconnect: (socket: Socket) => void;
};
//# sourceMappingURL=quizController.d.ts.map