import { RedisClientType } from 'redis';
declare class RedisClient {
    private client;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getClient(): RedisClientType;
    set(key: string, value: string, expireInSeconds?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<number>;
    exists(key: string): Promise<number>;
}
declare const redisClient: RedisClient;
export default redisClient;
//# sourceMappingURL=redis.d.ts.map