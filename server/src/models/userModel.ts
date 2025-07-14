import type { User, UserModel } from "../types"

// Create a functional model using closure
export const createUserModel = (): UserModel => {
  const users = new Map<string, User>()

  const generateId = (): string => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const create = (userData: Omit<User, "id" | "joinedAt">): User => {
    const user: User = {
      id: generateId(),
      ...userData,
      joinedAt: new Date(),
    }

    users.set(user.socketId, user)
    return user
  }

  const findBySocketId = (socketId: string): User | undefined => {
    return users.get(socketId)
  }

  const findById = (id: string): User | undefined => {
    return Array.from(users.values()).find((user) => user.id === id)
  }

  const getAll = (): User[] => {
    return Array.from(users.values())
  }

  const deleteUser = (socketId: string): boolean => {
    return users.delete(socketId)
  }

  const clear = (): void => {
    users.clear()
  }

  return {
    create,
    findBySocketId,
    findById,
    getAll,
    delete: deleteUser,
    clear,
  }
}

// Singleton instance using functional approach
let userModelInstance: UserModel | null = null

export const getUserModel = (): UserModel => {
  if (!userModelInstance) {
    userModelInstance = createUserModel()
  }
  return userModelInstance
}
