import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace ProcessAllErrors {

  export class NoIncomesFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'No incomes found for this user'
      } as UseCaseError)
    }
  }

}
