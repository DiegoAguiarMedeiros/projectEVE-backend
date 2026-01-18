
import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export namespace ChangePasswordErrors {

    export class IncorrectPasswordError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `The password you entered is incorrect.`
            } as UseCaseError)
        }
    }
}
