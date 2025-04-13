
import { RedisAuthService } from "./redis/redisAuthService";
import { redisConnection } from "./redis/redisConnection";

const authService = new RedisAuthService(
  redisConnection
)

export { authService }