
import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace DeleteEnvelopeErrors {

    export class EnvelopeNotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Envelope id: ${id} was not found!`
            } as UseCaseError)
        }
    }
    export class EnvelopeCanNotBeDeleted extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Envelope id: ${id} can not be deleted!`
            } as UseCaseError)
        }
    }


}