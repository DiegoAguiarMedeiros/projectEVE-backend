import { AppError } from "../../../../shared/core/AppError";
import { Either, left, right } from "../../../../shared/core/Result";
import { Result } from "../../../../shared/core/Result";
import { Interface as IEnvelopesRepository } from "../../repos/Interface";
import { Interface as ITransactionsRepository } from "../../../transactions/repos/Interface";
import { Transactions } from "../../../transactions/domain";
import { Description } from "../../../../shared/domain/Description";
import { Balance } from "../../../../shared/domain/Balance";
import { Id } from "../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";

interface Request {
    userId: string;
    fromEnvelopeId: string;
    toEnvelopeId: string;
    amount: number;
    year: number;
    month: number;
}

import { TransferEnvelopeBalanceErrors } from "./TransferEnvelopeBalanceErrors";

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
        private transactionsRepository: ITransactionsRepository
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

        // Get current amounts for the specific month/year
        const fromAmount = await this.envelopesRepository.getAmount(fromEnvelopeId, year, month);
        const toAmount = await this.envelopesRepository.getAmount(toEnvelopeId, year, month);

        const currentFromAmount = fromAmount ? Number(fromAmount) : 0;
        const currentToAmount = toAmount ? Number(toAmount) : 0;

        if (currentFromAmount < amount) {
            return left(new TransferEnvelopeBalanceErrors.InsufficientFundsError("Insufficient funds in source envelope"));
        }

        const newFromAmount = currentFromAmount - amount;
        const newToAmount = currentToAmount + amount;

        // Update amounts
        await this.envelopesRepository.addAmount(fromEnvelopeId, newFromAmount, year, month);

        if (toAmount === null) {
            await this.envelopesRepository.createAmount(toEnvelopeId, newToAmount, year, month);
        } else {
            await this.envelopesRepository.addAmount(toEnvelopeId, newToAmount, year, month);
        }

        // Create transaction records for both envelopes
        try {
            const transferDate = new Date(year, month - 1, new Date().getDate());

            // Create debit transaction for source envelope
            const fromDescriptionOrError = Description.create({
                description: `Transferência para ${toEnvelope.name}`
            });
            const fromAmountOrError = Balance.create({ balance: amount });
            const fromEnvelopeIdOrError = Id.create(new UniqueEntityID(fromEnvelopeId));

            if (fromDescriptionOrError.isFailure || fromAmountOrError.isFailure || fromEnvelopeIdOrError.isFailure) {
                console.error("Error creating value objects for source transaction");
            } else {
                const fromTransactionOrError = Transactions.create({
                    envelopeId: fromEnvelopeIdOrError.getValue(),
                    description: fromDescriptionOrError.getValue(),
                    amount: fromAmountOrError.getValue(),
                    date: transferDate,
                    type: "Debit",
                    status: "Completed",
                    paymentMethod: "BankTransfer"
                });

                if (fromTransactionOrError.isSuccess) {
                    await this.transactionsRepository.create(fromTransactionOrError.getValue());
                }
            }

            // Create credit transaction for destination envelope
            const toDescriptionOrError = Description.create({
                description: `Transferência de ${fromEnvelope.name}`
            });
            const toAmountOrError = Balance.create({ balance: amount });
            const toEnvelopeIdOrError = Id.create(new UniqueEntityID(toEnvelopeId));

            if (toDescriptionOrError.isFailure || toAmountOrError.isFailure || toEnvelopeIdOrError.isFailure) {
                console.error("Error creating value objects for destination transaction");
            } else {
                const toTransactionOrError = Transactions.create({
                    envelopeId: toEnvelopeIdOrError.getValue(),
                    description: toDescriptionOrError.getValue(),
                    amount: toAmountOrError.getValue(),
                    date: transferDate,
                    type: "Credit",
                    status: "Completed",
                    paymentMethod: "BankTransfer"
                });

                if (toTransactionOrError.isSuccess) {
                    await this.transactionsRepository.create(toTransactionOrError.getValue());
                }
            }
        } catch (err) {
            console.error("Error creating transfer transactions:", err);
            // Don't fail the transfer if transaction creation fails
        }

        return right(null);
    }
}
