export type LogLevel = "info" | "warn" | "error" | "debug";
export declare const createLogger: () => {
    log: (level: LogLevel, message: string, meta?: any) => void;
    info: (message: string, meta?: any) => void;
    warn: (message: string, meta?: any) => void;
    error: (message: string, meta?: any) => void;
    debug: (message: string, meta?: any) => void;
};
export declare const getLogger: () => {
    log: (level: LogLevel, message: string, meta?: any) => void;
    info: (message: string, meta?: any) => void;
    warn: (message: string, meta?: any) => void;
    error: (message: string, meta?: any) => void;
    debug: (message: string, meta?: any) => void;
};
//# sourceMappingURL=logger.d.ts.map