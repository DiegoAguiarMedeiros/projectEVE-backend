import { Result } from "../../../../shared/core/Result"
import { UseCaseError } from "../../../../shared/core/UseCaseError"



export namespace UpdateErrors {

    export class NameAlreadyExist extends Result<UseCaseError> {
        constructor(name: string) {
            super(false, {
                message: `errors.envelopes.name_already_exists`
            } as UseCaseError)
        }
    }
    export class UpdateError extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `errors.envelopes.update_error`
            } as UseCaseError)
        }
    }
    export class NotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `errors.envelopes.not_found`
            } as UseCaseError)
        }
    }
    export class NameCanNotBeChanged extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `errors.envelopes.name_cannot_be_changed`
            } as UseCaseError)
        }
    }

    export class ExceedsTotalPercentageError extends Result<UseCaseError> {
        constructor(total: number) {
            super(false, {
                message: `errors.envelopes.exceeds_percentage`
            } as UseCaseError)
        }
    }


}