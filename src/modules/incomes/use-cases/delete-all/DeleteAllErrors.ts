import { Result } from "../../../../shared/core/Result"
import { UseCaseError } from "../../../../shared/core/UseCaseError"

export namespace DeleteAllErrors {

    export class NothingToDelete extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `No income ids provided`
            } as UseCaseError)
        }
    }

}
