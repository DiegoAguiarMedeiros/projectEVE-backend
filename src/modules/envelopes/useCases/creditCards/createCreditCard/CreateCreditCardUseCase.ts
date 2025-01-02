
import { CreateCreditCardDTO } from "./CreateCreditCardDTO";
import { CreateCreditCardErrors } from "./CreateCreditCardErrors";
import { Either, Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { ICreditCardRepo } from "../../../repos/CreditCardRepo";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Name } from "../../../domain/name";
import { CreditCard } from "../../../domain/creditCard";
import { Id } from "../../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Balance } from "../../../domain/balance";
import { CreateCreditCardResponse } from "./CreateCreditCardResponse";
import { Flag } from "../../../domain/flag";

export class CreateCreditCardUseCase implements UseCase<CreateCreditCardDTO, Promise<CreateCreditCardResponse>> {
  private CreditCardRepo: ICreditCardRepo;

  constructor(CreditCardRepo: ICreditCardRepo) {
    this.CreditCardRepo = CreditCardRepo;
  }

  async execute(request: CreateCreditCardDTO): Promise<CreateCreditCardResponse> {
    const nameOrError = Name.create({ name: request.name });
    const flagOrError = Flag.create({ flag: request.flag });
    const userIdOrError = Id.create(new UniqueEntityID(request.userId));
    const idorError = Id.create(request.id);

    const dtoResult = Result.combine([
      nameOrError, userIdOrError, idorError, flagOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateCreditCardResponse;
    }

    const id: Id = idorError.getValue();
    const name: Name = nameOrError.getValue();
    const flag: Flag = flagOrError.getValue();
    const userId: Id = userIdOrError.getValue();

    try {

      const checkname = await this.CreditCardRepo.checkName(request.name, request.userId.toString());
      if (checkname) {
        return left(
          new CreateCreditCardErrors.NameTakenError(request.name)
        ) as CreateCreditCardResponse;
      }

      const creditCardOrError: Result<CreditCard> = CreditCard.create({
        id,
        name,
        userId,
        flag,
        active: request.active,
      });

      if (creditCardOrError.isFailure) {
        return left(
          Result.fail<CreditCard>(creditCardOrError.getErrorValue().toString())
        ) as CreateCreditCardResponse;
      }

      const creditCard: CreditCard = creditCardOrError.getValue();

      await this.CreditCardRepo.save(creditCard);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateCreditCardResponse;
    }
  }
}