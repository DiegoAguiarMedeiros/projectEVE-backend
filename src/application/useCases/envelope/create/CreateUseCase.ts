
import { Color } from "../../../../domain/shared/Color";
import { Envelope } from "../../../../domain/entities/envelope/Envelope";
import { Percentage } from "../../../../domain/entities/envelope/Percentage";
import { Interface as IEnvelopeRepo } from "../../../../domain/repositories/envelope/Interface";
import { Balance } from "../../../../domain/shared/Balance";
import { AppError } from "../../../../domain/shared/core/AppError";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { Id } from "../../../../domain/shared/Id";
import { Name } from "../../../../domain/shared/Name";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";
import { CreateErrors } from "./CreateErrors";
import { CreateResponse } from "./CreateResponse";
import { CreateDTO } from "../../../../domain/dto/envelope";


export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IEnvelopeRepo;

  constructor(repo: IEnvelopeRepo) {
    this.repo = repo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const nameOrError = Name.create({ name: request.name });
    const balanceOrError = Balance.create({ balance: request.balance });
    const userIdOrError = Id.create(new UniqueEntityID(request.userId));
    const idOrError = Id.create(new UniqueEntityID());
    const colorOrError = Color.create({ color: request.color });
    const percentageOrError = Percentage.create({ percentage: request.percentage });

    const dtoResult = Result.combine([
      nameOrError, userIdOrError, idOrError, balanceOrError,colorOrError, percentageOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const id: Id = idOrError.getValue();
    const name: Name = nameOrError.getValue();
    const balance: Balance = balanceOrError.getValue();
    const userId: Id = userIdOrError.getValue();
    const color: Color = colorOrError.getValue();
    const percentage: Percentage = percentageOrError.getValue();

    try {

      const checkname = await this.repo.checkName(request.name, request.userId.toString());
      if (checkname) {
        return left(
          new CreateErrors.NameTakenError(request.name)
        ) as CreateResponse;
      }

      const EnvelopeOrError: Result<Envelope> = Envelope.create({
        id,
        name,
        userId,
        balance: balance,
        active: request.active,
        is_editable: request.is_editable,
        color,
        percentage
      });

      if (EnvelopeOrError.isFailure) {
        return left(
          Result.fail<Envelope>(EnvelopeOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const envelope: Envelope = EnvelopeOrError.getValue();

      await this.repo.create(envelope);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}