
import { createClient } from 'redis';
import { RedisClientType } from '@redis/client';
import { authConfig } from '../../../../config';

const redisConnection: RedisClientType = createClient({
    url: authConfig.redisConnectionString,
    socket: {
      tls: true,
      rejectUnauthorized: false,
    }
  })

console.log("authConfig", authConfig)

redisConnection.connect().then(() => {
  console.info(`[Redis]: Connected to redis server at ${authConfig.redisConnectionString}`)
}).catch((err) => {
  console.error(`[Redis]: Failed to connect to ${authConfig.redisConnectionString}`);
  console.error(err);
});
redisConnection.on('connect', () => {
  console.info(`[Redis]: Connected to redis server at ${authConfig.redisConnectionString}`)
});

export { redisConnection }
