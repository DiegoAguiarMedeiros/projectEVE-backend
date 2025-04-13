import { Result } from "../../../../domain/shared/core/Result";
import { UseCaseError } from "../../../../domain/shared/core/UseCaseError";

export namespace CreateErrors {

  export class NameTakenError extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: `The name ${name} was already taken`
      } as UseCaseError)
    }
  }


}