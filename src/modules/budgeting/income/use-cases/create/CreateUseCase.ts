
import { CreateDTO } from "../../dtos";
import { Interface as IIncomesRepo } from "../../repos/Interface";
import { Balance } from "../../../../../shared/domain/Balance";
import { Description } from "../../../../../shared/domain/Description";
import { Id } from "../../../../../shared/domain/Id";
import { PaymentDay } from "../../../../../shared/domain/PaymentDay";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { AppError } from "../../../../../shared/core/AppError";
import { Result, left, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { CreateResponse } from "./CreateResponse";
import { Income } from "../../domain";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IIncomesRepo;

  constructor(repo: IIncomesRepo) {
    this.repo = repo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const UserIdOrError = Id.create(new UniqueEntityID(request.userId));
    const PaymentDayOrError = PaymentDay.create({ paymentDay: request.paymentDay });
    const dtoResult = Result.combine([
      DescriptionOrError, AmountOrError, UserIdOrError, PaymentDayOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const userId: Id = UserIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const paymentDay: PaymentDay = PaymentDayOrError.getValue();

  
    try {

      const incomeOrError: Result<Income> = Income.create({
        userId,
        description,
        amount,
        paymentDay,
      }, new UniqueEntityID());

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