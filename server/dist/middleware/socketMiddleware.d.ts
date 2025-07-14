import type { Socket } from "socket.io";
import type { ExtendedError } from "socket.io/dist/namespace";
export declare const createAuthMiddleware: () => (socket: Socket, next: (err?: ExtendedError) => void) => void;
export declare const createRateLimitMiddleware: () => (socket: Socket, next: (err?: ExtendedError) => void) => void;
export declare const createValidationMiddleware: () => (socket: Socket, next: (err?: ExtendedError) => void) => void;
export declare const createSocketMiddleware: () => {
    auth: (socket: Socket, next: (err?: ExtendedError) => void) => void;
    rateLimit: (socket: Socket, next: (err?: ExtendedError) => void) => void;
    validation: (socket: Socket, next: (err?: ExtendedError) => void) => void;
};
//# sourceMappingURL=socketMiddleware.d.ts.map