import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"



export namespace CreateErrors {

  export class EmailAlreadyExistsError extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `The email ${email} associated for this account already exists`
      } as UseCaseError)
    }
  }

  export class NameTakenError extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: `The name ${name} was already taken`
      } as UseCaseError)
    }
  }


}