import { Result } from "../../../../domain/shared/core/Result"
import { UseCaseError } from "../../../../domain/shared/core/UseCaseError"

export namespace DeleteErrors {

    export class NotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Investment id: ${id} was not found!`
            } as UseCaseError)
        }
    }
    export class CanNotBeDeleted extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Investment id: ${id} can not be deleted!`
            } as UseCaseError)
        }
    }


}