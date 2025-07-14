"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketMiddleware = exports.createValidationMiddleware = exports.createRateLimitMiddleware = exports.createAuthMiddleware = void 0;
// Functional middleware using higher-order functions
const createAuthMiddleware = () => {
    return (socket, next) => {
        // Add authentication logic here if needed
        console.log(`Socket attempting to connect: ${socket.id}`);
        next();
    };
};
exports.createAuthMiddleware = createAuthMiddleware;
const createRateLimitMiddleware = () => {
    const connectionCounts = new Map();
    const RATE_LIMIT = 10; // connections per minute
    const WINDOW_MS = 60 * 1000; // 1 minute
    return (socket, next) => {
        const clientIp = socket.handshake.address;
        const now = Date.now();
        const windowStart = now - WINDOW_MS;
        // Clean old entries
        for (const [ip, timestamp] of connectionCounts.entries()) {
            if (timestamp < windowStart) {
                connectionCounts.delete(ip);
            }
        }
        // Check rate limit
        const connections = Array.from(connectionCounts.entries()).filter(([ip, timestamp]) => ip === clientIp && timestamp > windowStart).length;
        if (connections >= RATE_LIMIT) {
            next(new Error("Rate limit exceeded"));
            return;
        }
        connectionCounts.set(`${clientIp}-${now}`, now);
        next();
    };
};
exports.createRateLimitMiddleware = createRateLimitMiddleware;
const createValidationMiddleware = () => {
    return (socket, next) => {
        // Add request validation logic here if needed
        const userAgent = socket.handshake.headers["user-agent"];
        if (!userAgent) {
            next(new Error("Invalid client"));
            return;
        }
        next();
    };
};
exports.createValidationMiddleware = createValidationMiddleware;
// Factory function to create all middleware
const createSocketMiddleware = () => {
    return {
        auth: (0, exports.createAuthMiddleware)(),
        rateLimit: (0, exports.createRateLimitMiddleware)(),
        validation: (0, exports.createValidationMiddleware)(),
    };
};
exports.createSocketMiddleware = createSocketMiddleware;
//# sourceMappingURL=socketMiddleware.js.map