
import { UseCaseError } from "../../../../shared/core/UseCaseError"
import { Result } from "../../../../shared/core/Result"

export namespace UpdateEnvelopeNameErrors {

    export class EnvelopeNameAlreadyExist extends Result<UseCaseError> {
        constructor(name: string) {
            super(false, {
                message: `Envelope name: ${name} Already exist!`
            } as UseCaseError)
        }
    }
    export class EnvelopeUpdateError extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `[EnvelopeUpdateError]: An unexpected error occurred!`
            } as UseCaseError)
        }
    }
    export class EnvelopeNotFound extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Envelope id: ${id} was not found!`
            } as UseCaseError)
        }
    }
    export class EnvelopeNameCanNotBeChanged extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: `Envelope id: ${id} can not be Changed!`
            } as UseCaseError)
        }
    }


}