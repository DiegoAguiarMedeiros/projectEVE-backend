
import { CreateDTO } from "../../dtos";
import { Interface as IProcessedIncomesRepo } from "../../repos/Interface";
import { Balance } from "../../../../shared/domain/Balance";
import { Description } from "../../../../shared/domain/Description";
import { Id } from "../../../../shared/domain/Id";
import { PaymentDay } from "../../../../shared/domain/PaymentDay";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { CreateResponse } from "./CreateResponse";
import { ProcessedIncomes } from "../../domain";
import { Year } from "../../domain/Year";
import { Month } from "../../domain/Month";
import { Day } from "../../domain/Day";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IProcessedIncomesRepo;

  constructor(repo: IProcessedIncomesRepo) {
    this.repo = repo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const YearOrError = Year.create({ year: request.year });
    const MonthOrError = Month.create({ month: request.month });
    const DayOrError = Day.create({ day: request.day });
    const TotalIncomeProcessedOrError = Balance.create({ balance: request.totalIncomeProcessed });
    const UserIdOrError = Id.create(new UniqueEntityID(request.userId));
    const dtoResult = Result.combine([
      YearOrError, MonthOrError, UserIdOrError, TotalIncomeProcessedOrError,DayOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const userId: Id = UserIdOrError.getValue();
    const year: Year = YearOrError.getValue();
    const month: Month = MonthOrError.getValue();
    const day: Day = DayOrError.getValue();
    const totalIncomeProcessed: Balance = TotalIncomeProcessedOrError.getValue();

  
    try {

      const processedIncomeOrError: Result<ProcessedIncomes> = ProcessedIncomes.create({
        userId,
        year,
        month,
        day,
        totalIncomeProcessed,
        processedAt: new Date(),
        isReprocessed: false,
        isSplitted: request.isSplitted
      });

      if (processedIncomeOrError.isFailure) {
        return left(
          Result.fail<ProcessedIncomes>(processedIncomeOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const processedIncomes: ProcessedIncomes = processedIncomeOrError.getValue();
      await this.repo.create(processedIncomes);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}