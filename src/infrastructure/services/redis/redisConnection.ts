
import { createClient } from 'redis';
import { RedisClientType } from '@redis/client';
import { authConfig, isProduction } from '../../../config';

const port = authConfig.redisServerPort;
const host = authConfig.redisServerURL;
const redisConnection: RedisClientType = isProduction
  ? createClient({
    url: authConfig.redisConnectionString
  })
  : createClient({
    url: `${host}:${port}`
  }); // creates a new client

redisConnection.connect().then(() => {
  console.info(`[Redis]: Connected to redis server at ${host}:${port}`)
})
redisConnection.on('connect', () => {
  console.info(`[Redis]: Connected to redis server at ${host}:${port}`)
});

export { redisConnection }
