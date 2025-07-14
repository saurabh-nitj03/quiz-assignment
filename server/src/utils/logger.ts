// Functional logging utility
export type LogLevel = "info" | "warn" | "error" | "debug"

export const createLogger = () => {
  const log = (level: LogLevel, message: string, meta?: any) => {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
    }

    // In production, you might want to use a proper logging library
    console.log(JSON.stringify(logEntry))
  }

  const info = (message: string, meta?: any) => log("info", message, meta)
  const warn = (message: string, meta?: any) => log("warn", message, meta)
  const error = (message: string, meta?: any) => log("error", message, meta)
  const debug = (message: string, meta?: any) => log("debug", message, meta)

  return { log, info, warn, error, debug }
}

// Singleton logger instance
let loggerInstance: ReturnType<typeof createLogger> | null = null

export const getLogger = () => {
  if (!loggerInstance) {
    loggerInstance = createLogger()
  }
  return loggerInstance
}
