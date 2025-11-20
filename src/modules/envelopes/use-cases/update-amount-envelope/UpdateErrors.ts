import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export namespace UpdateErrors {

  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor (userId: string) {
      super(false, {
        message: `A user for user id ${userId} was not found`
      } as UseCaseError)
    }
  }
}