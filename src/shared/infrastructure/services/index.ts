
import { RedisAuthService } from "./redis/redisAuthService";
import { RedisPasswordResetService } from "./redis/redisPasswordResetService";
import { redisConnection } from "./redis/redisConnection";

const authService = new RedisAuthService(
  redisConnection
)

const passwordResetService = new RedisPasswordResetService(
  redisConnection
)

export { authService, passwordResetService }