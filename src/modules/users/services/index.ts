
import { redisConnection } from "../../../shared/services/redis/redisConnection";
import { RedisAuthService } from "./redis/redisAuthService";

const authService = new RedisAuthService(
  redisConnection
)

export { authService }