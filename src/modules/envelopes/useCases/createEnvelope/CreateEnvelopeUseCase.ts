
import { CreateEnvelopeDTO } from "./CreateEnvelopeDTO";
import { CreateEnvelopeErrors } from "./CreateEnvelopeErrors";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { IEnvelopeRepo } from "../../repos/EnvelopeRepo";
import { UseCase } from "../../../../shared/core/UseCase";
import { Name } from "../../domain/name";
import { Envelope } from "../../domain/envelope";
import { UserId } from "../../domain/userId";

type Response = Either<
  CreateEnvelopeErrors.NameTakenError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class CreateEnvelopeUseCase implements UseCase<CreateEnvelopeDTO, Promise<Response>> {
  private envelopeRepo: IEnvelopeRepo;

  constructor(EnvelopeRepo: IEnvelopeRepo) {
    this.envelopeRepo = EnvelopeRepo;
  }

  async execute(request: CreateEnvelopeDTO): Promise<Response> {
    console.log("CreateEnvelopeUseCase execute request ", request)
    const nameOrError = Name.create({ name: request.name });
    const userIdOrError = UserId.create({ userId: request.userId });

    const dtoResult = Result.combine([
      nameOrError, userIdOrError
    ]);
    console.log("dtoResult", dtoResult)
    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as Response;
    }

    const name: Name = nameOrError.getValue();
    const userId: UserId = userIdOrError.getValue();

    try {

      const EnvelopeOrError: Result<Envelope> = Envelope.create({
        name, userId
      });
      console.log("EnvelopeOrError", EnvelopeOrError)
      if (EnvelopeOrError.isFailure) {
        return left(
          Result.fail<Envelope>(EnvelopeOrError.getErrorValue().toString())
        ) as Response;
      }

      const envelope: Envelope = EnvelopeOrError.getValue();
      console.log("CreateEnvelopeUseCase execute envelope", envelope)
      await this.envelopeRepo.save(envelope);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}