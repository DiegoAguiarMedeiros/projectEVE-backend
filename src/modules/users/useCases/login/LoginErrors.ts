
import { UseCaseError } from "../../../../shared/core/UseCaseError"
import { Result } from "../../../../shared/core/Result"

export namespace LoginUseCaseErrors {

  export class NameDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Name or password incorrect.`
      } as UseCaseError)
    }
  }

  export class PasswordDoesntMatchError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Password doesnt match error.`
      } as UseCaseError)
    }
  }

}