
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
import { Interface as IMonthlyEnvelopeRepo } from "../../repos/Interface";
import { Envelopes } from "../../../envelopes/domain/Envelopes";
import pLimit from 'p-limit';


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

  constructor(processedIncomesRepo: IProcessedIncomesRepo,
    createUseCase: CreateUseCase,
    envelopsRepo: IEnvelopsRepo,
    fixedExpensesRepo: IFixedExpensesRepo,
    goalsRepo: IGoalsRepo
  ) {
    this.processedIncomesRepo = processedIncomesRepo;
    this.createUseCase = createUseCase;
    this.envelopsRepo = envelopsRepo;
    this.fixedExpensesRepo = fixedExpensesRepo;
    this.goalsRepo = goalsRepo;
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




      if (processedIncomes.isSplitted) {

        const limit = pLimit(10);
        const promises: any[] = [];
        envelopes.forEach(envelope => {

          promises.push(
            limit(() => {
              this.createUseCase.execute({
                envelopeId: envelope.id.toString(),
                description: `Depósito salário ${processedIncomes?.month.value}/${processedIncomes?.year.value}`,
                amount: (processedIncomes!.totalIncomeProcessed.value * envelope.percentage.value) / 100,
                date: new Date(`${processedIncomes?.year.value}/${processedIncomes?.month.value}/${processedIncomes?.day.value}`),
                type: "Credit",
                status: "Completed",
                paymentMethod: 'Cash',
                userId: envelope.userId.value
              })
            })
          );

          if (envelope.name.value === 'goals' && goals) {
            goals.forEach(goals => {
              promises.push(
                limit(() => {
                  this.createUseCase.execute({
                    envelopeId: goals.envelopeId.value,
                    description: goals.description.value,
                    amount: (((processedIncomes!.totalIncomeProcessed.value * envelope.percentage.value) / 100) * goals.percentage.value) / 100,
                    date: new Date(`${processedIncomes?.year.value}/${processedIncomes?.month.value}/${processedIncomes?.day.value}`),
                    type: "Debit",
                    status: "Pending",
                    paymentMethod: 'Cash',
                    userId: processedIncomes.userId.value
                  })
                })
              );
            })
          }

        })

        if (fixedExpenses) {
          fixedExpenses.forEach(fixedExpense => {
            promises.push(
              limit(() => {
                this.createUseCase.execute({
                  envelopeId: fixedExpense.envelopeId.value,
                  description: fixedExpense.description.value,
                  amount: fixedExpense.amount.value,
                  date: new Date(`${processedIncomes?.year.value}/${processedIncomes?.month.value}/${fixedExpense?.paymentDay.value}`),
                  type: "Debit",
                  status: "Pending",
                  paymentMethod: 'Cash',
                  userId: processedIncomes.userId.value
                })
              })
            );
          })
        }

        await Promise.allSettled(promises);
      }
      return right(Result.ok<void>());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}