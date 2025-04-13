
import { UseCaseError } from "../../../../domain/shared/core/UseCaseError"
import { Result } from "../../../../domain/shared/core/Result"

export namespace CreateErrors {

  export class NameTakenError extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: `The name ${name} was already taken`
      } as UseCaseError)
    }
  }
  export class EnvelopeNotFound extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `The envelope ${id} was not found`
      } as UseCaseError)
    }
  }


}