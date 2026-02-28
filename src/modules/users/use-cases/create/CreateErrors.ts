import { Result } from "../../../../shared/core/Result"
import { UseCaseError } from "../../../../shared/core/UseCaseError"



export namespace CreateErrors {

  export class EmailAlreadyExistsError extends Result<UseCaseError> {
    constructor(_email: string) {
      super(false, {
        message: 'auth.errors.email_already_exists'
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