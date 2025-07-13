import { Result } from "../../../../shared/core/Result"
import { UseCaseError } from "../../../../shared/core/UseCaseError"


export namespace UpdateErrors {

    export class AlreadyExist extends Result<UseCaseError> {
        constructor(name: string) {
            super(false, {
                message: `Goals name: ${name} Already exist!`
            } as UseCaseError)
        }
    }
    export class UpdateError extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `[UpdatedErrors]: An unexpected error occurred!`
            } as UseCaseError)
        }
    }
    export class NotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Goals id: ${id} was not found!`
            } as UseCaseError)
        }
    }
    export class CanNotBeChanged extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Goals id: ${id} can not be Changed!`
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