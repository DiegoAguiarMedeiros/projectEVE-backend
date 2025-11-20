
import { createClient } from 'redis';
import { RedisClientType } from '@redis/client';
import { authConfig, isProduction } from '../../../../config';

const port = authConfig.redisServerPort;
const host = authConfig.redisServerURL;
const redisConnection: RedisClientType = isProduction
  ? createClient({
    url: authConfig.redisConnectionString,
    socket: {
      tls: true,
      rejectUnauthorized: false,
    }
  })
  : createClient({
    url: `${host}:${port}`, socket: {
      tls: true,
      rejectUnauthorized: false,
    }
  }); // creates a new client

console.log("authConfig", authConfig)

redisConnection.connect().then(() => {
  console.info(`[Redis]: Connected to redis server at ${host}:${port}`)
}).catch((err) => {
  console.error(`[Redis]: Failed to connect to ${host}:${port}`);
  console.error(err);
});
redisConnection.on('connect', () => {
  console.info(`[Redis]: Connected to redis server at ${host}:${port}`)
});

export { redisConnection }
