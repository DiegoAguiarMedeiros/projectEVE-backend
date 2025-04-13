
import { Income } from "../../../../domain/entities/income/Income";
import { Interface as IIncomesRepo} from "../../../../domain/repositories/income/Interface";
import { Balance } from "../../../../domain/shared/Balance";
import { Description } from "../../../../domain/shared/Description";
import { Id } from "../../../../domain/shared/Id";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";
import { AppError } from "../../../../domain/shared/core/AppError";
import { Result, left, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { CreateDTO } from "./CreateDTO";
import { CreateResponse } from "./CreateResponse";

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
    const paymentDay: number = request.paymentDay;

    try {

      const incomeOrError: Result<Income> = Income.create({
        id,
        userId,
        description,
        amount,
        paymentDay,
      });

      if (incomeOrError.isFailure) {
        return left(
          Result.fail<Income>(incomeOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const income: Income = incomeOrError.getValue();

      await this.repo.create(income);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}