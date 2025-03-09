import { createClient } from 'redis';
import * as Errors from '../errors';
import { logger } from '../logger';

export type SerializablePrimitive = string | number | boolean;
export type SerializableArray = string[] | number[] | boolean[]
export type SerializableObject = Record<string, SerializablePrimitive>;
export type Serializable = SerializablePrimitive | SerializableArray | SerializableObject;

export class CacheClient {
    private host: string;
    private port: string;
    private username: string;
    private password: string;
    private redis: ReturnType<typeof createClient>;
    private readonly appPrefix = 'INFINITEA_WEB';

    constructor(options?) {
        const { username, password, host, port } = options || {};

        if (username && password && host && port) {
            this.redis = createClient({
                url: `redis://${this.username}:${this.password}@${this.host}:${this.port}`
            });
        } else {
            logger.debug('Initializing cache client directly from env vars');
            const { REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

            if (!REDIS_USERNAME || !REDIS_PASSWORD) throw new Errors.LoadedError(Errors.Code.CACHE_CREDENTIALS_MISSING);
            if (!REDIS_HOST || !REDIS_PORT) throw new Errors.LoadedError(Errors.Code.CACHE_URL_MISSING)

            const url = `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;
            this.redis = createClient({ url });
            this.redis.connect();
            this.redis.on('error', (error) => {
                logger.error('Cache client errored', {
                    errorMessage: error?.message || error,
                });
            });
        }
    }

    private async ensureConnected() {
        if (!this.redis.isReady) {
            try {
                await this.redis.connect();
            } catch (error) {
                logger.error('Failed to connect to cache server', {
                    errorMessage: error?.message,
                    errorStack: error?.stack,
                });

                throw error;
            }
        }
    }

    async set<T>(id: string, value: T) {
        await this.ensureConnected();
        const key = `${this.appPrefix}:${id}`;
        const ttl = 604800; // 1 week in seconds
        await this.redis.set(key, JSON.stringify(value), { EX: ttl });
        return;
    }

    async get<T>(id: string) {
        await this.ensureConnected();
        const key = `${this.appPrefix}:${id}`;
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) as T : undefined;
    }

    async delete(id: string) {
        await this.ensureConnected();
        const key = `${this.appPrefix}:${id}`;
        const exists = await this.redis.exists(key);
        if (!exists) return;
        await this.redis.del(key);
        return;
    }
}

export default new CacheClient();
