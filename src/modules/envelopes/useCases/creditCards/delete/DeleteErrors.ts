
import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace DeleteErrors {

    export class NotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Credit Cards id: ${id} was not found!`
            } as UseCaseError)
        }
    }
    export class CanNotBeDeleted extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Credit Cards id: ${id} can not be deleted!`
            } as UseCaseError)
        }
    }


}