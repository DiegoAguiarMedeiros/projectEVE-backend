import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export namespace CreateErrors {

  export class DebtDoesntExistError extends Result<UseCaseError> {
    constructor (debtId: string) {
      super(false, {
        message: `A debt for debt id ${debtId} was not found`
      } as UseCaseError)
    }
  }
}