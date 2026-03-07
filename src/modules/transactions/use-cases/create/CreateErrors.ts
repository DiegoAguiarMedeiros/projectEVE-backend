import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace CreateErrors {

  export class EnvelopeNotFound extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `The envelope ${id} was not found`
      } as UseCaseError)
    }
  }

  export class ExceedsEnvelopeBudget extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `errors.transactions.exceeds_budget`
      } as UseCaseError)
    }
  }
}