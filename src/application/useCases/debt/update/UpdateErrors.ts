
import { UseCaseError } from "../../../../domain/shared/core/UseCaseError"
import { Result } from "../../../../domain/shared/core/Result"

export namespace UpdateErrors {

    export class AlreadyExist extends Result<UseCaseError> {
        constructor(name: string) {
            super(false, {
                message: `Debt name: ${name} Already exist!`
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
                message: `Debt id: ${id} was not found!`
            } as UseCaseError)
        }
    }
    export class CanNotBeChanged extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Debt id: ${id} can not be Changed!`
            } as UseCaseError)
        }
    }


}