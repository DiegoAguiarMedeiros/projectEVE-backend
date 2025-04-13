import { Result } from "../../../../domain/shared/core/Result";
import { UseCaseError } from "../../../../domain/shared/core/UseCaseError";

export namespace GetByIdErrors {

    export class NotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Transaction id: ${id} was not found!`
            } as UseCaseError)
        }
    }
}