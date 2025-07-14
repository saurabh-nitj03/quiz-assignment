"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = exports.createLogger = void 0;
const createLogger = () => {
    const log = (level, message, meta) => {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...(meta && { meta }),
        };
        // In production, you might want to use a proper logging library
        console.log(JSON.stringify(logEntry));
    };
    const info = (message, meta) => log("info", message, meta);
    const warn = (message, meta) => log("warn", message, meta);
    const error = (message, meta) => log("error", message, meta);
    const debug = (message, meta) => log("debug", message, meta);
    return { log, info, warn, error, debug };
};
exports.createLogger = createLogger;
// Singleton logger instance
let loggerInstance = null;
const getLogger = () => {
    if (!loggerInstance) {
        loggerInstance = (0, exports.createLogger)();
    }
    return loggerInstance;
};
exports.getLogger = getLogger;
//# sourceMappingURL=logger.js.map