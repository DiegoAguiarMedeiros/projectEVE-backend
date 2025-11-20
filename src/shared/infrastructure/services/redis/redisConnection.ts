
import { createClient } from 'redis';
import { RedisClientType } from '@redis/client';
import { authConfig } from '../../../../config';

import net from 'net';

const socket = net.createConnection(Number(authConfig.redisServerPort), authConfig.redisServerURL);

socket.on("connect", () => console.log("Conectou!", Number(authConfig.redisServerPort), authConfig.redisServerURL));
socket.on("error", (e) => console.log("Erro:", e, Number(authConfig.redisServerPort), authConfig.redisServerURL));


const redisConnection: RedisClientType = createClient({
  url: authConfig.redisConnectionString,
  socket: {
    tls: false,
  }
})

console.log("authConfig", authConfig, {
  url: authConfig.redisConnectionString,
  socket: {
    tls: false,
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
