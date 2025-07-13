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
}