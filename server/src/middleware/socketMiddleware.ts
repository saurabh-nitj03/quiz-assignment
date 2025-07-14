import type { Socket } from "socket.io"
import type { ExtendedError } from "socket.io/dist/namespace"

// Functional middleware using higher-order functions
export const createAuthMiddleware = () => {
  return (socket: Socket, next: (err?: ExtendedError) => void) => {
    // Add authentication logic here if needed
    console.log(`Socket attempting to connect: ${socket.id}`)
    next()
  }
}

export const createRateLimitMiddleware = () => {
  const connectionCounts = new Map<string, number>()
  const RATE_LIMIT = 10 // connections per minute
  const WINDOW_MS = 60 * 1000 // 1 minute

  return (socket: Socket, next: (err?: ExtendedError) => void) => {
    const clientIp = socket.handshake.address
    const now = Date.now()
    const windowStart = now - WINDOW_MS

    // Clean old entries
    for (const [ip, timestamp] of connectionCounts.entries()) {
      if (timestamp < windowStart) {
        connectionCounts.delete(ip)
      }
    }

    // Check rate limit
    const connections = Array.from(connectionCounts.entries()).filter(
      ([ip, timestamp]) => ip === clientIp && timestamp > windowStart,
    ).length

    if (connections >= RATE_LIMIT) {
      next(new Error("Rate limit exceeded"))
      return
    }

    connectionCounts.set(`${clientIp}-${now}`, now)
    next()
  }
}

export const createValidationMiddleware = () => {
  return (socket: Socket, next: (err?: ExtendedError) => void) => {
    // Add request validation logic here if needed
    const userAgent = socket.handshake.headers["user-agent"]

    if (!userAgent) {
      next(new Error("Invalid client"))
      return
    }

    next()
  }
}

// Factory function to create all middleware
export const createSocketMiddleware = () => {
  return {
    auth: createAuthMiddleware(),
    rateLimit: createRateLimitMiddleware(),
    validation: createValidationMiddleware(),
  }
}
