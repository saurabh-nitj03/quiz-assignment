export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}
export declare const createDatabaseConfig: () => DatabaseConfig;
export declare const createDatabase: () => {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    getStatus: () => boolean;
    healthCheck: () => Promise<{
        status: string;
        timestamp: string;
    }>;
    config: DatabaseConfig;
};
export declare const getDatabase: () => {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    getStatus: () => boolean;
    healthCheck: () => Promise<{
        status: string;
        timestamp: string;
    }>;
    config: DatabaseConfig;
};
//# sourceMappingURL=database.d.ts.map