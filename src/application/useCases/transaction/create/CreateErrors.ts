import { Result } from "../../../../domain/shared/core/Result";
import { UseCaseError } from "../../../../domain/shared/core/UseCaseError";

export namespace CreateErrors {

  export class EnvelopeNotFound extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `The envelope ${id} was not found`
      } as UseCaseError)
    }
  }
}