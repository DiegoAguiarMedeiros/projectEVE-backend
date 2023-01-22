
const authConfig = {
  secret: process.env.PROJECT_EVE_APP_SECRET,
  tokenExpiryTime: 300, // seconds => 5 minutes
  redisServerPort: process.env.PROJECT_EVE_REDIS_PORT || 6379,
  redisServerURL: process.env.PROJECT_EVE_REDIS_URL,
  redisConnectionString: process.env.REDIS_URL
}

export { authConfig }