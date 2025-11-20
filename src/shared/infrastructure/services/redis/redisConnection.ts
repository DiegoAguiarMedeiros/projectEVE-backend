
import { createClient } from 'redis';
import { RedisClientType } from '@redis/client';
import { authConfig } from '../../../../config';

const redisConnection: RedisClientType = createClient({
  url: authConfig.redisConnectionString,
  socket: {
    tls: false,            // obrigatório
    connectTimeout: 10000  // opcional, só para evitar timeout rápido
  }
})

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
