import { ProcessAllDTO } from "../../dtos";
import { Interface as IProcessedIncomesRepo } from "../../repos/Interface";
import { Interface as IIncomesRepo } from "../../../incomes/repos/Interface";
import { Interface as ITransactionsRepo } from "../../../transactions/repos/Interface";
import { DeleteAll } from "../../../transactions/use-cases/delete-all-by-processed-incomes-id/DeleteAll";
import { DeleteUseCase as DeleteTransactionUseCase } from "../../../transactions/use-cases/delete/DeleteUseCase";
import { Id } from "../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { ProcessAllResponse } from "./ProcessAllResponse";
import { ProcessAllErrors } from "./ProcessAllErrors";
import { ProcessedIncomes } from "../../domain";
import { Year } from "../../domain/Year";
import { Month } from "../../domain/Month";
import { Day } from "../../domain/Day";

export class ProcessAllUseCase implements UseCase<ProcessAllDTO, Promise<ProcessAllResponse>> {
  private processedIncomesRepo: IProcessedIncomesRepo;
  private incomesRepo: IIncomesRepo;
  private deleteAllTransactions: DeleteAll;
  private transactionsRepo: ITransactionsRepo;
  private deleteTransactionUseCase: DeleteTransactionUseCase;

  constructor(
    processedIncomesRepo: IProcessedIncomesRepo,
    incomesRepo: IIncomesRepo,
    deleteAllTransactions: DeleteAll,
    transactionsRepo: ITransactionsRepo,
    deleteTransactionUseCase: DeleteTransactionUseCase,
  ) {
    this.processedIncomesRepo = processedIncomesRepo;
    this.incomesRepo = incomesRepo;
    this.deleteAllTransactions = deleteAllTransactions;
    this.transactionsRepo = transactionsRepo;
    this.deleteTransactionUseCase = deleteTransactionUseCase;
  }

  async execute(request: ProcessAllDTO): Promise<ProcessAllResponse> {
    const YearOrError = Year.create({ year: request.year });
    const MonthOrError = Month.create({ month: request.month });
    const UserIdOrError = Id.create(new UniqueEntityID(request.userId));

    const dtoResult = Result.combine([YearOrError, MonthOrError, UserIdOrError]);
    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as ProcessAllResponse;
    }

    try {
      const incomes = await this.incomesRepo.getAll(request.userId);

      if (incomes.length === 0) {
        return left(new ProcessAllErrors.NoIncomesFound()) as ProcessAllResponse;
      }

      const userId: Id = UserIdOrError.getValue();
      const year: Year = YearOrError.getValue();
      const month: Month = MonthOrError.getValue();

      // Limpa processamentos anteriores do mesmo mês antes de criar novos
      const existingForMonth = await this.processedIncomesRepo.getAllByYearMonth(
        request.userId,
        request.year,
        request.month,
      );

      await Promise.all(
        existingForMonth.map(async (existing) => {
          await this.deleteAllTransactions.execute({
            processedIncomesId: existing.id.toString(),
          });
          await this.processedIncomesRepo.delete(existing.id.toString());
        })
      );

      // Remove transações órfãs revertendo o saldo dos envelopes corretamente
      const orphaned = await this.transactionsRepo.getOrphanedTransactionsByMonth(request.userId, request.year, request.month);
      for (const transaction of orphaned) {
        await this.deleteTransactionUseCase.execute({ id: transaction.id.toString(), userId: request.userId });
      }
      await this.transactionsRepo.deleteOrphanedByUserAndMonth(request.userId, request.year, request.month);

      await Promise.all(
        incomes.map(async (income, index) => {
          const dayOrError = Day.create({ day: income.paymentDay.value });
          if (dayOrError.isFailure) {
            throw new Error(dayOrError.getErrorValue().toString());
          }

          const processedIncomeOrError = ProcessedIncomes.create({
            description: income.description,
            userId,
            year,
            month,
            day: dayOrError.getValue(),
            totalIncomeProcessed: income.amount,
            processedAt: new Date(),
            isReprocessed: false,
            isSplitted: true,
            shouldAddFixedExpenses: index === 0,
          });

          if (processedIncomeOrError.isFailure) {
            throw new Error(processedIncomeOrError.getErrorValue().toString());
          }

          await this.processedIncomesRepo.create(processedIncomeOrError.getValue());
        })
      );

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as ProcessAllResponse;
    }
  }
}
