
import { CreateDTO } from "./CreateDTO";
import { CreateErrors } from "./CreateErrors";
import { CreateResponse } from "./CreateResponse";
import { Either, Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { IEnvelopeRepo } from "../../../repos/EnvelopeRepo";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Name } from "../../../domain/name";
import { Envelope } from "../../../domain/envelope";
import { Id } from "../../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Balance } from "../../../domain/balance";


export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IEnvelopeRepo;

  constructor(repo: IEnvelopeRepo) {
    this.repo = repo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const nameOrError = Name.create({ name: request.name });
    const balanceOrError = Balance.create({ balance: request.balance });
    const userIdOrError = Id.create(new UniqueEntityID(request.userId));
    const idorError = Id.create(request.id);

    const dtoResult = Result.combine([
      nameOrError, userIdOrError, idorError, balanceOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const id: Id = idorError.getValue();
    const name: Name = nameOrError.getValue();
    const balance: Balance = balanceOrError.getValue();
    const userId: Id = userIdOrError.getValue();

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
        is_editable: request.is_editable
      });

      if (EnvelopeOrError.isFailure) {
        return left(
          Result.fail<Envelope>(EnvelopeOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const envelope: Envelope = EnvelopeOrError.getValue();

      await this.repo.save(envelope);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}