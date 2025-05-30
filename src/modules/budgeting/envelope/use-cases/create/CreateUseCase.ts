
import { Color } from "../../../../../shared/domain/Color";
import { Percentage } from "../../../../../shared/domain/Percentage";
import { Interface as IEnvelopeRepo } from "../../repos/Interface";
import { AppError } from "../../../../../shared/core/AppError";
import { left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Id } from "../../../../../shared/domain/Id";
import { Name } from "../../../../../shared/domain/Name";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { CreateErrors } from "./CreateErrors";
import { CreateResponse } from "./CreateResponse";
import { CreateDTO } from "../../dtos";
import { Envelope } from "../../domain/Envelope";


export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IEnvelopeRepo;

  constructor(repo: IEnvelopeRepo) {
    this.repo = repo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const nameOrError = Name.create({ name: request.name });
    const userIdOrError = Id.create(new UniqueEntityID(request.userId));
    const colorOrError = Color.create({ color: request.color });
    const percentageOrError = Percentage.create({ percentage: request.percentage });


    const dtoResult = Result.combine([
      nameOrError, userIdOrError,  colorOrError, percentageOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const name: Name = nameOrError.getValue();
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
        name,
        userId,
        color,
        percentage
      }, new UniqueEntityID());

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