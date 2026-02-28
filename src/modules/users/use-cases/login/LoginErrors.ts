import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace LoginUseCaseErrors {

  export class EmailDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'auth.login_error'
      } as UseCaseError)
    }
  }

  export class EmailNotVerifiedError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'auth.errors.email_not_verified'
      } as UseCaseError)
    }
  }

}