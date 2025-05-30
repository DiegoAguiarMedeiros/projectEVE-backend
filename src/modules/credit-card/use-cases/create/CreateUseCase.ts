import { CreateErrors } from "./CreateErrors";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { AppError } from "../../../../shared/core/AppError";
import { UseCase } from "../../../../shared/core/UseCase";
import { CreateResponse } from "./CreateResponse";
import { Interface as ICreditCardRepo } from "../../repos/Interface";
import { Id } from "../../../../shared/domain/Id";
import { Name } from "../../../../shared/domain/Name";
import { Result, left, right } from "../../../../shared/core/Result";
import { CreateDTO } from "../../dtos";
import { Flag, CreditCard } from "../../domain";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private creditCardRepo: ICreditCardRepo;

  constructor(creditCardRepo: ICreditCardRepo) {
    this.creditCardRepo = creditCardRepo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const nameOrError = Name.create({ name: request.name });
    const flagOrError = Flag.create({ flag: request.flag });
    const userIdOrError = Id.create(new UniqueEntityID(request.userId));
    const idorError = Id.create(new UniqueEntityID());

    const dtoResult = Result.combine([
      nameOrError, userIdOrError, idorError, flagOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const id: Id = idorError.getValue();
    const name: Name = nameOrError.getValue();
    const flag: Flag = flagOrError.getValue();
    const userId: Id = userIdOrError.getValue();

    try {

      const checkname = await this.creditCardRepo.checkName(request.name, request.userId.toString());
      if (checkname) {
        return left(
          new CreateErrors.NameTakenError(request.name)
        ) as CreateResponse;
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
        ) as CreateResponse;
      }

      const creditCard: CreditCard = creditCardOrError.getValue();

      await this.creditCardRepo.create(creditCard);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}