
import { createClient } from 'redis';
import { RedisClientType } from '@redis/client';
import { authConfig, isProduction } from '../../../../config';

const port = authConfig.redisServerPort;
const host = authConfig.redisServerURL;
const redisConnection: RedisClientType = isProduction
  ? createClient({
    url: authConfig.redisConnectionString
  })
  : createClient({
    url: `${host}:${port}`
  }); // creates a new client

redisConnection.on('connect', () => {
  console.log(`[Redis]: Connected to redis server at ${host}:${port}`)
});

export { redisConnection }
