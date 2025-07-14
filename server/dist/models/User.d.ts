import type { User } from "../types";
export declare class UserModel {
    private static instance;
    private users;
    private constructor();
    static getInstance(): UserModel;
    create(userData: Omit<User, "id" | "joinedAt">): User;
    findBySocketId(socketId: string): User | undefined;
    findById(id: string): User | undefined;
    getAll(): User[];
    delete(socketId: string): boolean;
    clear(): void;
    private generateId;
}
//# sourceMappingURL=User.d.ts.map