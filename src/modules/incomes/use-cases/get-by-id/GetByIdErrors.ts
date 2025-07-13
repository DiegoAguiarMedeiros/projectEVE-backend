import { Result } from "../../../../shared/core/Result"
import { UseCaseError } from "../../../../shared/core/UseCaseError"

export namespace GetByIdErrors {

    export class NotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Debt id: ${id} was not found!`
            } as UseCaseError)
        }
    }
    export class CanNotBeDeleted extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Debt id: ${id} can not be deleted!`
            } as UseCaseError)
        }
    }


}