import type { User } from "../types"

export class UserModel {
  private static instance: UserModel
  private users: Map<string, User> = new Map()

  private constructor() {}

  public static getInstance(): UserModel {
    if (!UserModel.instance) {
      UserModel.instance = new UserModel()
    }
    return UserModel.instance
  }

  public create(userData: Omit<User, "id" | "joinedAt">): User {
    const user: User = {
      id: this.generateId(),
      ...userData,
      joinedAt: new Date(),
    }

    this.users.set(user.socketId, user)
    return user
  }

  public findBySocketId(socketId: string): User | undefined {
    return this.users.get(socketId)
  }

  public findById(id: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.id === id)
  }

  public getAll(): User[] {
    return Array.from(this.users.values())
  }

  public delete(socketId: string): boolean {
    return this.users.delete(socketId)
  }

  public clear(): void {
    this.users.clear()
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
