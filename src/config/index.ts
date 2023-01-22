
import { authConfig } from "./auth";

const isProduction = process.env.PROJECT_EVE_IS_PRODUCTION === "true";

export {
  isProduction,
  authConfig
}