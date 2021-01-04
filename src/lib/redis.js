const Redis = require('ioredis');

class Cache {
    constructor() {
        this.redis = new Redis({
            host: process.env.RD_HOST || 'localhost',
            port: process.env.RD_PORT || 6379,
            keyPrefix: 'cache:',
        });
    }

    async get(key) {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
    }

    set(key, value, timeExpired) {
        return this.redis.set(key, JSON.stringify(value), 'EX', timeExpired);
    }

    del(key) {
        return this.redis.del(key);
    }

    async delPrefix(prefix) {
        const keys = (await this.redis.keys(`cache:${prefix}:*`)).map((key) =>
            key.replace('cache:', '')
        );
        return this.redis.del(keys);
    }
}

module.exports = new Cache();
