import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace CreateErrors {

  export class NameTakenError extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: `errors.envelopes.name_already_exists`
      } as UseCaseError)
    }
  }

  export class ExceedsTotalPercentageError extends Result<UseCaseError> {
    constructor(total: number) {
      super(false, {
        message: `errors.envelopes.exceeds_percentage`
      } as UseCaseError)
    }
  }

}