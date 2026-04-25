import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace CreateErrors {

  export class NameTakenError extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: `The name ${name} was already taken`
      } as UseCaseError)
    }
  }

  export class EnvelopesNotDistributed extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'errors.envelopes.not_distributed'
      } as UseCaseError)
    }
  }

  export class EnvelopeRequired extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'errors.processed_incomes.envelope_required'
      } as UseCaseError)
    }
  }

  export class EnvelopeNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'errors.processed_incomes.envelope_not_found'
      } as UseCaseError)
    }
  }

}