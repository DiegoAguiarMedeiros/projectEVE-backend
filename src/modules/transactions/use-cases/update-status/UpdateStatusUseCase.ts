import { TransactionsStatus } from "../../domain";
import { Interface as ITransactionsRepo } from "../../repos/Interface";
import { Interface as IEnvelopeRepo } from "../../../envelopes/repos/Interface";
import { Interface as IDebtRepo } from "../../../debts/repos/Interface";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { AppError } from "../../../../shared/core/AppError";
import { UpdateStatusErrors } from "./UpdateStatusErrors";
import { UpdateStatusResponse } from "./UpdateStatusResponse";
import { UpdateStatusDTO } from "../../dtos";


export class UpdateStatusUseCase implements UseCase<UpdateStatusDTO, Promise<UpdateStatusResponse>> {
    private repo: ITransactionsRepo;
    private envelopeRepo: IEnvelopeRepo;
    private debtRepo: IDebtRepo;

    constructor(repo: ITransactionsRepo, envelopeRepo: IEnvelopeRepo, debtRepo: IDebtRepo) {
        this.repo = repo;
        this.envelopeRepo = envelopeRepo;
        this.debtRepo = debtRepo;
    }

    async execute(data: UpdateStatusDTO): Promise<Promise<UpdateStatusResponse>> {

        try {

            const transaction = await this.repo.getById(data.request.id, data.request.userId);
            if (!transaction) {
                return left(
                    new UpdateStatusErrors.NotFound(data.request.id)
                ) as UpdateStatusResponse;
            }

            const oldStatus: TransactionsStatus = transaction.status;
            const newStatus: TransactionsStatus = data.fieldUpdate.status ? data.fieldUpdate.status : transaction.status;

            await this.repo.updateStatus(transaction.id.toString(), newStatus);

            if (oldStatus !== newStatus && transaction.amount.value > 0) {
                const year = transaction.date.getFullYear();
                const month = transaction.date.getMonth() + 1;
                const currentBalance = await this.envelopeRepo.getAmount(transaction.envelopeId.value, year, month);
                const amount = transaction.amount.value;

                const isDebit = transaction.type === 'Debit';
                const becomingCompleted = newStatus === 'transaction.status.completed';

                if (currentBalance !== null) {
                    const delta = becomingCompleted
                        ? (isDebit ? -amount : amount)
                        : (isDebit ? amount : -amount);
                    await this.envelopeRepo.addAmount(transaction.envelopeId.value, Number(currentBalance) + delta, year, month);
                } else if (becomingCompleted) {
                    const initialAmount = isDebit ? -amount : amount;
                    await this.envelopeRepo.createAmount(transaction.envelopeId.value, initialAmount, year, month);
                }
            }

            if (oldStatus !== newStatus && transaction.debtId) {
                const becomingCompleted = newStatus === 'transaction.status.completed';
                const wasCompleted = oldStatus === 'transaction.status.completed';

                if (becomingCompleted) {
                    await this.debtRepo.updateInstallmentsPaid(transaction.debtId.value, 1);
                } else if (wasCompleted) {
                    await this.debtRepo.updateInstallmentsPaid(transaction.debtId.value, -1);
                }
            }

            return right(Result.ok<void>()) as UpdateStatusResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateStatusResponse;
        }
    }

}