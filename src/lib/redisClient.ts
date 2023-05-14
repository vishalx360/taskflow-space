import ioredis from 'ioredis'
import { env } from '../env.mjs'

const globalForRedis = global as unknown as { redisClient: ioredis }

export const redisClient = globalForRedis.redisClient ?? new ioredis({
    host: env.REDIS_HOST,
    password: env.REDIS_PASSWORD,
    port: 13014
})

redisClient.on('error', (err) => {
    console.error('Redis error: ', err)
})
redisClient.on("connect", () => {
    console.log("Redis connected");
});

if (process.env.NODE_ENV !== 'production') {
    globalForRedis.redisClient = redisClient
}