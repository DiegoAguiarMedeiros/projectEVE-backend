import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace VerifyEmailErrors {
  export class InvalidOrExpiredTokenError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "auth.errors.invalid_or_expired_token",
      } as UseCaseError);
    }
  }
}
