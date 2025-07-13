import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace DeleteErrors {

    export class NotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Transaction id: ${id} was not found!`
            } as UseCaseError)
        }
    }

}