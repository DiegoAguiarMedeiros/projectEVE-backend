
import { createClient } from 'redis';
import { RedisClientType } from '@redis/client';
import { authConfig } from '../../../../config';

import net from 'net';

const socket = net.createConnection(6379, "oregon-keyvalue.render.com");

socket.on("connect", () => console.log("Conectou!"));
socket.on("error", (e) => console.log("Erro:", e));


const redisConnection: RedisClientType = createClient({
  url: authConfig.redisConnectionString,
  socket: {
    tls: false, 
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
