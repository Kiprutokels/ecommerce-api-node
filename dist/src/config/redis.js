"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
class RedisClient {
    client;
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            socket: {
                reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
            },
        });
        this.client.on('error', (err) => {
            console.error('❌ Redis Client Error:', err);
        });
        this.client.on('connect', () => {
            console.log('✅ Redis connected successfully');
        });
        this.client.on('disconnect', () => {
            console.log('⚠️ Redis disconnected');
        });
    }
    async connect() {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }
    async disconnect() {
        if (this.client.isOpen) {
            await this.client.quit();
        }
    }
    getClient() {
        return this.client;
    }
    async set(key, value, expireInSeconds) {
        if (expireInSeconds) {
            await this.client.setEx(key, expireInSeconds, value);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async get(key) {
        return this.client.get(key);
    }
    async del(key) {
        return this.client.del(key);
    }
    async exists(key) {
        return this.client.exists(key);
    }
}
const redisClient = new RedisClient();
exports.default = redisClient;
//# sourceMappingURL=redis.js.map