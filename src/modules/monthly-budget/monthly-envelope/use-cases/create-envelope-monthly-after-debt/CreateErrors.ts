import { UseCaseError } from "../../../../../shared/core/UseCaseError";
import { Result } from "../../../../../shared/core/Result";

export namespace CreateErrors {

  export class DebtDoesntExistError extends Result<UseCaseError> {
    constructor (debtId: string) {
      super(false, {
        message: `A debt for debt id ${debtId} doesn't exist or was deleted.`
      } as UseCaseError)
    }
  }
  export class EnvelopeDoesntExistError extends Result<UseCaseError> {
    constructor (envelopeId: string) {
      super(false, {
        message: `A envelope for envelope id ${envelopeId} doesn't exist or was deleted.`
      } as UseCaseError)
    }
  }
}