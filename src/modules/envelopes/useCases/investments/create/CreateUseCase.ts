
import { CreateDTO } from "./CreateDTO";
import { Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { IInvestmentsRepo } from "../../../repos/InvestmentsRepo";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Id } from "../../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { CreateResponse } from "./CreateResponse";
import { Debt } from "../../../domain/debt";
import { Description } from "../../../domain/description";
import { DebtsStatus } from "../../../domain/debtsStatus";
import { Balance } from "../../../domain/balance";
import { Investments } from "../../../domain/investments";
import { InvestmentsStatus } from "../../../domain/investmentsStatus";
import { InvestmentsType } from "../../../domain/investmentsType";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IInvestmentsRepo;

  constructor(repo: IInvestmentsRepo) {
    this.repo = repo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const UserIdOrError = Id.create(new UniqueEntityID(request.userId));
    const IdOrError = Id.create(new UniqueEntityID());

    const dtoResult = Result.combine([
      DescriptionOrError, AmountOrError, UserIdOrError, IdOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const id: Id = IdOrError.getValue();
    const userId: Id = UserIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const applicationDate: Date = request.applicationDate;
    const maturityDate: Date = request.maturityDate;
    const status: InvestmentsStatus = request.status;
    const type: InvestmentsType = request.type;

    try {

      const investmentsOrError: Result<Investments> = Investments.create({
        id,
        userId,
        description,
        amount,
        applicationDate,
        maturityDate,
        status,
        type
      });

      if (investmentsOrError.isFailure) {
        return left(
          Result.fail<Debt>(investmentsOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const investment: Investments = investmentsOrError.getValue();

      await this.repo.save(investment);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}