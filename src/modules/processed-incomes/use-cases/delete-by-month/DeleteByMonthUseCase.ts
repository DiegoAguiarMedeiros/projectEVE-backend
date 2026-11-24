import { Interface as IProcessedIncomesRepo } from "../../repos/Interface";
import { Interface as ITransactionsRepo } from "../../../transactions/repos/Interface";
import { Interface as IEnvelopesRepo } from "../../../envelopes/repos/Interface";
import { Interface as IDebtRepo } from "../../../debts/repos/Interface";
import { AppError } from "../../../../shared/core/AppError";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DeleteByMonthResponse } from "./DeleteByMonthResponse";
import { ResetAll } from "../../../transactions/use-cases/reset-all-by-processed-incomes-id/ResetAll";

export interface DeleteByMonthDTO {
    year: number;
    month: number;
    userId: string;
}

export class DeleteByMonthUseCase implements UseCase<DeleteByMonthDTO, Promise<DeleteByMonthResponse>> {
    private repo: IProcessedIncomesRepo;
    private resetAll: ResetAll;
    private transactionsRepo: ITransactionsRepo;
    private envelopesRepo: IEnvelopesRepo;
    private debtRepo?: IDebtRepo;

    constructor(
        repo: IProcessedIncomesRepo,
        resetAll: ResetAll,
        transactionsRepo: ITransactionsRepo,
        envelopesRepo: IEnvelopesRepo,
        debtRepo?: IDebtRepo,
    ) {
        this.repo = repo;
        this.resetAll = resetAll;
        this.transactionsRepo = transactionsRepo;
        this.envelopesRepo = envelopesRepo;
        this.debtRepo = debtRepo;
    }

    async execute({ year, month, userId }: DeleteByMonthDTO): Promise<DeleteByMonthResponse> {
        try {
            const items = await this.repo.getAllByYearMonth(userId, year, month);
            const ids = items.map(item => item.id.toString());

            // Reset transactions and envelope balances synchronously before deleting,
            // so that a subsequent reprocess sees a consistent state.
            for (const item of items) {
                await this.resetAll.execute({
                    processedIncomesId: item.id.toString(),
                    userId,
                    year,
                    month,
                });
            }

            // If there were no processed incomes for the month, still reset any completed debt transactions
            if (items.length === 0) {
                const independentDebtTransactions = await this.transactionsRepo.getDebtTransactionsByMonth(userId, year, month);
                for (const transaction of independentDebtTransactions) {
                    if (transaction.status === 'transaction.status.completed' && transaction.debtId?.value && this.debtRepo) {
                        await this.debtRepo.updateInstallmentsPaid(transaction.debtId.value, -1);
                    }
                }
                await this.transactionsRepo.resetDebtsByMonth(userId, year, month);
            }

            // Remove all remaining non-debt transactions of the month (manual expenses, credits, reallocations)
            await this.transactionsRepo.deleteNonDebtByUserAndMonth(userId, year, month);

            // Remove monthly envelope balance records so reprocessing starts from a clean slate
            await this.envelopesRepo.deleteAmountsByUserAndMonth(userId, year, month);

            if (ids.length > 0) {
                await this.repo.deleteAll(ids, userId);
            }

            return right(Result.ok<void>()) as DeleteByMonthResponse;
        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteByMonthResponse;
        }
    }
}
