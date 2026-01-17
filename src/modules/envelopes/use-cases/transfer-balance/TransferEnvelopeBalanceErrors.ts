import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace TransferEnvelopeBalanceErrors {

    export class EnvelopeNotFoundError extends Result<UseCaseError> {
        constructor(message: string) {
            super(false, { message } as UseCaseError)
        }
    }

    export class InvalidTransferError extends Result<UseCaseError> {
        constructor(message: string) {
            super(false, { message } as UseCaseError)
        }
    }

    export class InsufficientFundsError extends Result<UseCaseError> {
        constructor(message: string) {
            super(false, { message } as UseCaseError)
        }
    }
}
