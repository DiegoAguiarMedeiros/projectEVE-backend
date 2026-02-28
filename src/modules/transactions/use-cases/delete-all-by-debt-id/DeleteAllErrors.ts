import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export namespace DeleteAllErrors {

  export class DebtDoesntExistError extends Result<UseCaseError> {
    constructor(debtId: string) {
      super(false, {
        message: `No transactions found for debt id ${debtId}`
      } as UseCaseError)
    }
  }

  export class TransactionDeleteAllError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Transaction Delete All by Debt error`
      } as UseCaseError)
    }
  }
}
