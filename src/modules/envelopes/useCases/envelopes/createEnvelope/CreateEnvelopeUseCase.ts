
import { CreateEnvelopeDTO } from "./CreateEnvelopeDTO";
import { CreateEnvelopeErrors } from "./CreateEnvelopeErrors";
import { Either, Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { IEnvelopeRepo } from "../../../repos/EnvelopeRepo";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Name } from "../../../domain/name";
import { Envelope } from "../../../domain/envelope";
import { Id } from "../../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Balance } from "../../../domain/balance";

type Response = Either<
  CreateEnvelopeErrors.NameTakenError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class CreateEnvelopeUseCase implements UseCase<CreateEnvelopeDTO, Promise<Response>> {
  private envelopeRepo: IEnvelopeRepo;

  constructor(envelopeRepo: IEnvelopeRepo) {
    this.envelopeRepo = envelopeRepo;
  }

  async execute(request: CreateEnvelopeDTO): Promise<Response> {
    const nameOrError = Name.create({ name: request.name });
    const balanceOrError = Balance.create({ balance: request.balance });
    const userIdOrError = Id.create(new UniqueEntityID(request.userId));
    const idorError = Id.create(request.id);

    const dtoResult = Result.combine([
      nameOrError, userIdOrError, idorError, balanceOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as Response;
    }

    const id: Id = idorError.getValue();
    const name: Name = nameOrError.getValue();
    const balance: Balance = balanceOrError.getValue();
    const userId: Id = userIdOrError.getValue();

    try {

      const checkname = await this.envelopeRepo.checkName(request.name, request.userId.toString());
      if (checkname) {
        return left(
          new CreateEnvelopeErrors.NameTakenError(request.name)
        ) as Response;
      }

      const EnvelopeOrError: Result<Envelope> = Envelope.create({
        id,
        name,
        userId,
        balance: balance,
        active: request.active,
        is_editable: request.is_editable
      });

      if (EnvelopeOrError.isFailure) {
        return left(
          Result.fail<Envelope>(EnvelopeOrError.getErrorValue().toString())
        ) as Response;
      }

      const envelope: Envelope = EnvelopeOrError.getValue();

      await this.envelopeRepo.save(envelope);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}