import { UseCaseError } from "../../../../../shared/core/UseCaseError";
import { Result } from "../../../../../shared/core/Result";

export namespace CreateErrors {

  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor (userId: string) {
      super(false, {
        message: `A user for user id ${userId} doesn't exist or was deleted.`
      } as UseCaseError)
    }
  }
}