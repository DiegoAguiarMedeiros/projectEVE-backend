
import { UseCaseError } from "../../../../domain/shared/core/UseCaseError"
import { Result } from "../../../../domain/shared/core/Result"

export namespace GetByIdErrors {

    export class NotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Envelope id: ${id} was not found!`
            } as UseCaseError)
        }
    }
    export class CanNotBeDeleted extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Envelope id: ${id} can not be deleted!`
            } as UseCaseError)
        }
    }


}