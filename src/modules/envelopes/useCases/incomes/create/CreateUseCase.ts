
import { CreateDTO } from "./CreateDTO";
import { Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { IIncomesRepo } from "../../../repos/IncomesRepo";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Id } from "../../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { CreateResponse } from "./CreateResponse";
import { Debt } from "../../../domain/debt";
import { Description } from "../../../domain/description";
import { DebtsStatus } from "../../../domain/debtsStatus";
import { Balance } from "../../../domain/balance";
import { Income } from "../../../domain/income";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IIncomesRepo;

  constructor(repo: IIncomesRepo) {
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
    const paymentDate: Date = request.paymentDate;

    try {

      const incomeOrError: Result<Income> = Income.create({
        id,
        userId,
        description,
        amount,
        paymentDate,
      });

      if (incomeOrError.isFailure) {
        return left(
          Result.fail<Income>(incomeOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const income: Income = incomeOrError.getValue();

      await this.repo.save(income);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}