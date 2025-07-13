
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

  constructor(processedIncomesRepo: IProcessedIncomesRepo,
    createUseCase: CreateUseCase,
    envelopsRepo: IEnvelopsRepo,
  ) {
    this.processedIncomesRepo = processedIncomesRepo;
    this.createUseCase = createUseCase;
    this.envelopsRepo = envelopsRepo;
  }

  public async execute(request: CreateDTO): Promise<Response> {

    let processedIncomes: ProcessedIncomes | null = null;
    let envelopes: Envelopes[] | null = null;
    const { processedIncomesId } = request;

    try {
      processedIncomes = await this.processedIncomesRepo.getOnlyById(processedIncomesId);
    } catch (err) {
      console.error("Error fetching processedIncomes:", err);
      return left(new CreateErrors.ProcessedIncomesDoesntExistError(processedIncomesId));
    }


    if (!processedIncomes) {
      console.error("ProcessedIncomes not found for ID:", processedIncomesId);
      return left(new CreateErrors.ProcessedIncomesDoesntExistError(processedIncomesId));
    }

    try {
      envelopes = await this.envelopsRepo.getAll(processedIncomes.userId.value, undefined, undefined, 'order');
    } catch (err) {
      console.error("Error fetching envelopes:", err);
      return left(new CreateErrors.ProcessedIncomesDoesntExistError(processedIncomes.userId.value));
    }

    try {

      if (processedIncomes.isSplitted) {

        // console.log("envelopes", envelopes)
        const limit = pLimit(10);
        const promises: any[] = [];
        envelopes.forEach(envelope => {

          promises.push(
            limit(() => {
              this.createUseCase.execute({
                envelopeId: envelope.id.toString(),
                description: `Depósito salário ${processedIncomes?.month.value}/${processedIncomes?.year.value}`,
                amount: (processedIncomes!.totalIncomeProcessed.value * envelope.percentage.value) / 100,
                date: new Date(),
                type: "Credit",
                status: "Completed",
                paymentMethod: 'Cash'
              })
            })
          );

        })
        await Promise.allSettled(promises);
      }
      return right(Result.ok<void>());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}