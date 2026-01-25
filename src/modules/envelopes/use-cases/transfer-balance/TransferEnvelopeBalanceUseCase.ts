import { AppError } from "../../../../shared/core/AppError";
import { Either, left, right } from "../../../../shared/core/Result";
import { Interface as IEnvelopesRepository } from "../../repos/Interface";
import { CreateUseCase } from "../../../transactions/use-cases/create/CreateUseCase";
import { TransferEnvelopeBalanceErrors } from "./TransferEnvelopeBalanceErrors";

interface Request {
    userId: string;
    fromEnvelopeId: string;
    toEnvelopeId: string;
    amount: number;
    year: number;
    month: number;
}

type Response = Either<
    AppError.UnexpectedError |
    TransferEnvelopeBalanceErrors.EnvelopeNotFoundError |
    TransferEnvelopeBalanceErrors.InvalidTransferError |
    TransferEnvelopeBalanceErrors.InsufficientFundsError,
    null
>;

export class TransferEnvelopeBalanceUseCase {
    constructor(
        private envelopesRepository: IEnvelopesRepository,
        private createTransactionUseCase: CreateUseCase
    ) { }

    async execute({
        userId,
        fromEnvelopeId,
        toEnvelopeId,
        amount,
        year,
        month,
    }: Request): Promise<Response> {
        if (amount <= 0) {
            return left(new TransferEnvelopeBalanceErrors.InvalidTransferError("Amount must be greater than zero"));
        }

        if (fromEnvelopeId === toEnvelopeId) {
            return left(new TransferEnvelopeBalanceErrors.InvalidTransferError("Cannot transfer to the same envelope"));
        }

        const fromEnvelope = await this.envelopesRepository.getById(fromEnvelopeId, userId);
        if (!fromEnvelope) {
            return left(new TransferEnvelopeBalanceErrors.EnvelopeNotFoundError("Source envelope not found"));
        }

        const toEnvelope = await this.envelopesRepository.getById(toEnvelopeId, userId);
        if (!toEnvelope) {
            return left(new TransferEnvelopeBalanceErrors.EnvelopeNotFoundError("Destination envelope not found"));
        }

        // Get current amounts for the specific month/year to validate sufficient funds
        const fromAmount = await this.envelopesRepository.getAmount(fromEnvelopeId, year, month);
        const currentFromAmount = fromAmount ? Number(fromAmount) : 0;

        if (currentFromAmount < amount) {
            return left(new TransferEnvelopeBalanceErrors.InsufficientFundsError("Insufficient funds in source envelope"));
        }

        // Create transfer date
        const transferDate = new Date(year, month - 1, new Date().getDate());

        try {
            // Create debit transaction for source envelope
            const debitResult = await this.createTransactionUseCase.execute({
                userId: userId,
                envelopeId: fromEnvelopeId,
                description: `transfer.sent_to|${toEnvelope.name.value}`,
                amount: amount,
                date: transferDate,
                type: "Debit",
                status: "transaction.status.completed",
                paymentMethod: "envelope.transaction.payment_method.Reallocation",
                isTranslatable: true
            });

            if (debitResult.isLeft()) {
                const error = debitResult.value;
                console.error("Debit transaction creation failed:", error);
                return left(new AppError.UnexpectedError(`Failed to create debit transaction: ${error.getErrorValue ? error.getErrorValue() : error}`));
            }

            // Create credit transaction for destination envelope
            const creditResult = await this.createTransactionUseCase.execute({
                userId: userId,
                envelopeId: toEnvelopeId,
                description: `transfer.received_from|${fromEnvelope.name.value}`,
                amount: amount,
                date: transferDate,
                type: "Credit",
                status: "transaction.status.completed",
                paymentMethod: "envelope.transaction.payment_method.Reallocation",
                isTranslatable: true
            });

            if (creditResult.isLeft()) {
                const error = creditResult.value;
                console.error("Credit transaction creation failed:", error);
                // TODO: Consider rollback of debit transaction if credit fails
                return left(new AppError.UnexpectedError(`Failed to create credit transaction: ${error.getErrorValue ? error.getErrorValue() : error}`));
            }

            return right(null);
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
