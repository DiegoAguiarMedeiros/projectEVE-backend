import { UseCase } from "../../../../shared/core/UseCase";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { Interface as ITransactionRepo } from "../../repos/Interface";
import { Repository as IEnvelopeRepo } from "../../../envelopes/repos/implementation/Repository";

interface ResetAllDTO {
  processedIncomesId: string;
  userId: string;
  year: number;
  month: number;
}

type Response = Either<AppError.UnexpectedError, Result<void>>

export class ResetAll implements UseCase<ResetAllDTO, Promise<Response>> {
  private transactionsRepo: ITransactionRepo;
  private envelopeRepo: IEnvelopeRepo;

  constructor(transactionsRepo: ITransactionRepo, envelopeRepo: IEnvelopeRepo) {
    this.transactionsRepo = transactionsRepo;
    this.envelopeRepo = envelopeRepo;
  }

  public async execute(request: ResetAllDTO): Promise<Response> {
    try {
      const { processedIncomesId, userId, year, month } = request;

      const transactions = await this.transactionsRepo.getAllByProcessedIncomesId(processedIncomesId);

      // Reverse envelope balance for completed transactions
      for (const transaction of transactions) {
        if (transaction.status === 'transaction.status.completed') {
          const year = transaction.date.getFullYear();
          const month = transaction.date.getMonth() + 1;
          const envelopeAmount = await this.envelopeRepo.getAmount(transaction.envelopeId.value, year, month);

          if (envelopeAmount !== null) {
            const restored = transaction.type === 'Debit'
              ? Number(envelopeAmount) + Number(transaction.amount.value)
              : Number(envelopeAmount) - Number(transaction.amount.value);
            await this.envelopeRepo.addAmount(transaction.envelopeId.value, restored, year, month);
          }
        }
      }

      // Delete non-debt transactions; debt transactions are reset to pending and detached
      for (const transaction of transactions) {
        if (!transaction.debtId) {
          await this.transactionsRepo.delete(transaction.id.toString());
        }
      }

      // Reset remaining debt transactions (with processedIncomesId) to pending and detach
      await this.transactionsRepo.resetToUnprocessed(processedIncomesId);

      // Reset debt transactions for the month that were created independently (without processedIncomesId)
      const independentDebtTransactions = await this.transactionsRepo.getDebtTransactionsByMonth(userId, year, month);
      for (const transaction of independentDebtTransactions) {
        if (transaction.status === 'transaction.status.completed') {
          const txYear = transaction.date.getFullYear();
          const txMonth = transaction.date.getMonth() + 1;
          const envelopeAmount = await this.envelopeRepo.getAmount(transaction.envelopeId.value, txYear, txMonth);
          if (envelopeAmount !== null) {
            const restored = transaction.type === 'Debit'
              ? Number(envelopeAmount) + Number(transaction.amount.value)
              : Number(envelopeAmount) - Number(transaction.amount.value);
            await this.envelopeRepo.addAmount(transaction.envelopeId.value, restored, txYear, txMonth);
          }
        }
      }
      await this.transactionsRepo.resetDebtsByMonth(userId, year, month);

      return right(Result.ok<void>());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
