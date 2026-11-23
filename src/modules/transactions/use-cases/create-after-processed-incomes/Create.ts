
import { UseCase } from "../../../../shared/core/UseCase";
import { Repository as IRepo } from "../../repos/implementation/Repository";
import { CreateDTO } from "./CreateDTO";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { CreateErrors } from "./CreateErrors";
import { ProcessedIncomes } from "../../../processed-incomes/domain/ProcessedIncomes";
import { CreateUseCase } from "../create/CreateUseCase";
import { Interface as IProcessedIncomesRepo } from "../../../processed-incomes/repos/Interface";
import { Interface as IEnvelopsRepo } from "../../../envelopes/repos/Interface";
import { Interface as IFixedExpensesRepo } from "../../../fixed-expenses/repos/Interface";
import { Interface as IGoalsRepo } from "../../../goals/repos/Interface";
import { Interface as ITransactionsRepo } from "../../repos/Interface";
import { Envelopes } from "../../../envelopes/domain/Envelopes";
import pLimit from 'p-limit';
import { DeleteAll } from "../delete-all-by-processed-incomes-id/DeleteAll";


type Response = Either<
  CreateErrors.ProcessedIncomesDoesntExistError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class Create implements UseCase<CreateDTO, Promise<Response>> {
  private processedIncomesRepo: IProcessedIncomesRepo;
  private createUseCase: CreateUseCase
  private envelopsRepo: IEnvelopsRepo;
  private fixedExpensesRepo: IFixedExpensesRepo;
  private goalsRepo: IGoalsRepo;
  private deleteAllByProcessedIncomes: DeleteAll;
  private transactionsRepo: ITransactionsRepo;

  constructor(processedIncomesRepo: IProcessedIncomesRepo,
    createUseCase: CreateUseCase,
    envelopsRepo: IEnvelopsRepo,
    fixedExpensesRepo: IFixedExpensesRepo,
    goalsRepo: IGoalsRepo,
    deleteAllByProcessedIncomes: DeleteAll,
    transactionsRepo: ITransactionsRepo,
  ) {
    this.processedIncomesRepo = processedIncomesRepo;
    this.createUseCase = createUseCase;
    this.envelopsRepo = envelopsRepo;
    this.fixedExpensesRepo = fixedExpensesRepo;
    this.goalsRepo = goalsRepo;
    this.deleteAllByProcessedIncomes = deleteAllByProcessedIncomes;
    this.transactionsRepo = transactionsRepo;
  }

  public async execute(request: CreateDTO): Promise<Response> {
    try {
      const { processedIncomesId } = request;

      const processedIncomes = await this.processedIncomesRepo.getOnlyById(processedIncomesId);

      if (!processedIncomes) {
        console.error("ProcessedIncomes not found for ID:", processedIncomesId);
        return left(new CreateErrors.ProcessedIncomesDoesntExistError(processedIncomesId));
      }

      const envelopes = await this.envelopsRepo.getAll(processedIncomes.userId.value);

      if (!envelopes) {
        console.error("Envelope not found for user ID:", processedIncomesId);
        return left(new CreateErrors.ProcessedIncomesDoesntExistError(processedIncomesId));
      }

      const fixedExpenses = await this.fixedExpensesRepo.getAll(processedIncomes.userId.value);
      const goals = await this.goalsRepo.getAll(processedIncomes.userId.value);


      if (processedIncomes.isReprocessed) {
        await this.deleteAllByProcessedIncomes.execute({ processedIncomesId })
      }



      const clampDay = (year: number, month: number, day: number) =>
        Math.min(day, new Date(year, month, 0).getDate());

      if (!processedIncomes.isSplitted) {
        if (processedIncomes.envelopeId) {
          const validDay = clampDay(processedIncomes.year.value, processedIncomes.month.value, processedIncomes.day.value);
          await this.createUseCase.execute({
            processedIncomesId: processedIncomesId,
            envelopeId: processedIncomes.envelopeId.value,
            description: `deposit.salary|${processedIncomes.month.value}/${processedIncomes.year.value}`,
            amount: processedIncomes.totalIncomeProcessed.value,
            date: new Date(processedIncomes.year.value, processedIncomes.month.value - 1, validDay),
            type: "Credit",
            status: "transaction.status.completed",
            paymentMethod: 'envelope.transaction.payment_method.Cash',
            userId: processedIncomes.userId.value,
            isTranslatable: true
          });
        }

        if (processedIncomes.shouldAddFixedExpenses && fixedExpenses) {
          for (const fixedExpense of fixedExpenses) {
            const validDay = clampDay(processedIncomes.year.value, processedIncomes.month.value, fixedExpense.paymentDay.value);
            await this.createUseCase.execute({
              processedIncomesId: processedIncomesId,
              envelopeId: fixedExpense.envelopeId.value,
              description: fixedExpense.description.value,
              amount: fixedExpense.amount.value,
              date: new Date(processedIncomes.year.value, processedIncomes.month.value - 1, validDay),
              referenceYear: processedIncomes.year.value,
              referenceMonth: processedIncomes.month.value,
              type: "Debit",
              status: "transaction.status.pending",
              paymentMethod: fixedExpense.paymentMethod,
              creditCardId: fixedExpense.paymentMethod === 'envelope.transaction.payment_method.CreditCard'
                ? fixedExpense.creditCardId?.value
                : undefined,
              userId: processedIncomes.userId.value
            });
          }
        }

        return right(Result.ok<void>());
      }

      if (processedIncomes.isSplitted) {

        const limit = pLimit(10);
        const creditPromises: any[] = [];
        const goalPromises: any[] = [];
        const incomeDay = clampDay(processedIncomes.year.value, processedIncomes.month.value, processedIncomes.day.value);
        const incomeDate = new Date(processedIncomes.year.value, processedIncomes.month.value - 1, incomeDay);

        envelopes.forEach(envelope => {

          creditPromises.push(
            limit(async () => {
              return await this.createUseCase.execute({
                processedIncomesId: processedIncomesId,
                envelopeId: envelope.id.toString(),
                description: `deposit.salary|${processedIncomes?.month.value}/${processedIncomes?.year.value}`,
                amount: Math.round(processedIncomes!.totalIncomeProcessed.value * envelope.percentage.value) / 100,
                date: incomeDate,
                type: "Credit",
                status: "transaction.status.completed",
                paymentMethod: 'envelope.transaction.payment_method.Cash',
                userId: envelope.userId.value,
                isTranslatable: true
              });
            })
          );

          if (envelope.name.value === 'goals' && goals) {
            goals.forEach(goal => {
              goalPromises.push(
                limit(async () => {
                  return await this.createUseCase.execute({
                    processedIncomesId: processedIncomesId,
                    envelopeId: goal.envelopeId.value,
                    description: goal.description.value,
                    amount: Math.round(processedIncomes!.totalIncomeProcessed.value * envelope.percentage.value * goal.percentage.value) / 10000,
                    date: incomeDate,
                    type: "Debit",
                    status: "transaction.status.pending",
                    paymentMethod: 'envelope.transaction.payment_method.Cash',
                    userId: processedIncomes.userId.value
                  });
                })
              );
            });
          }

        });

        await Promise.allSettled(creditPromises);
        await Promise.allSettled(goalPromises);

        if (processedIncomes.shouldAddFixedExpenses && fixedExpenses) {
          for (const fixedExpense of fixedExpenses) {
            const validDay = clampDay(processedIncomes.year.value, processedIncomes.month.value, fixedExpense.paymentDay.value);
            await this.createUseCase.execute({
              processedIncomesId: processedIncomesId,
              envelopeId: fixedExpense.envelopeId.value,
              description: fixedExpense.description.value,
              amount: fixedExpense.amount.value,
              date: new Date(processedIncomes.year.value, processedIncomes.month.value - 1, validDay),
              referenceYear: processedIncomes.year.value,
              referenceMonth: processedIncomes.month.value,
              type: "Debit",
              status: "transaction.status.pending",
              paymentMethod: fixedExpense.paymentMethod,
              creditCardId: fixedExpense.paymentMethod === 'envelope.transaction.payment_method.CreditCard'
                ? fixedExpense.creditCardId?.value
                : undefined,
              userId: processedIncomes.userId.value
            });
          }
        }
      }
      return right(Result.ok<void>());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}