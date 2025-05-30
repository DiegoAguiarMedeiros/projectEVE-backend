import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace LoginUseCaseErrors {

  export class EmailDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Email or password incorrect.`
      } as UseCaseError)
    }
  }

}