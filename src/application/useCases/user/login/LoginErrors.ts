import { Result } from "../../../../domain/shared/core/Result";
import { UseCaseError } from "../../../../domain/shared/core/UseCaseError";

export namespace LoginUseCaseErrors {

  export class EmailDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Email or password incorrect.`
      } as UseCaseError)
    }
  }

}