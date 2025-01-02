
import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace UpdateNameErrors {

    export class NameAlreadyExist extends Result<UseCaseError> {
        constructor(name: string) {
            super(false, {
                message: `Envelope name: ${name} Already exist!`
            } as UseCaseError)
        }
    }
    export class UpdateError extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `[EnvelopeUpdateError]: An unexpected error occurred!`
            } as UseCaseError)
        }
    }
    export class NotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Envelope id: ${id} was not found!`
            } as UseCaseError)
        }
    }
    export class NameCanNotBeChanged extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Envelope id: ${id} can not be Changed!`
            } as UseCaseError)
        }
    }


}