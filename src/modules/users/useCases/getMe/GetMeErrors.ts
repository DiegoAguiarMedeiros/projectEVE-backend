
import { UseCaseError } from "../../../../shared/core/UseCaseError"
import { Result } from "../../../../shared/core/Result"

export namespace GetMeUseCaseErrors {

  export class EmailDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Email or password incorrect.`
      } as UseCaseError)
    }
  }

}