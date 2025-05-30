import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace CreateErrors {

  export class NameTakenError extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: `The name ${name} was already taken`
      } as UseCaseError)
    }
  }
  export class EnvelopeNotFound extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: `The envelope ${name} was not found!`
      } as UseCaseError)
    }
  }


}