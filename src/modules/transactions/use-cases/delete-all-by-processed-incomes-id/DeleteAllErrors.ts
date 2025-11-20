import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export namespace DeleteAllErrors {

  export class ProcessedIncomesDoesntExistError extends Result<UseCaseError> {
    constructor (processedIncomesId: string) {
      super(false, {
        message: `A processed incomes id ${processedIncomesId} was not found`
      } as UseCaseError)
    }
  }
  export class TransactionDeleteAllError extends Result<UseCaseError> {
    constructor () {
      super(false, {
        message: `Transaction Delete All error`
      } as UseCaseError)
    }
  }
  export class EnvelopesNotFound extends Result<UseCaseError> {
    constructor (userId: string) {
      super(false, {
        message: `Envelopes of user ${userId} was not found`
      } as UseCaseError)
    }
  }
}