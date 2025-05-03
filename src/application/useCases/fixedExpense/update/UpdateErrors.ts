import { Result } from "../../../../domain/shared/core/Result"
import { UseCaseError } from "../../../../domain/shared/core/UseCaseError"


export namespace UpdateErrors {

    export class AlreadyExist extends Result<UseCaseError> {
        constructor(name: string) {
            super(false, {
                message: `FixedExpense name: ${name} Already exist!`
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
                message: `FixedExpense id: ${id} was not found!`
            } as UseCaseError)
        }
    }
    export class CanNotBeChanged extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `FixedExpense id: ${id} can not be Changed!`
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