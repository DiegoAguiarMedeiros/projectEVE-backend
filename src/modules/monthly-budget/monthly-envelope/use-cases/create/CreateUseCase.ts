
import { Percentage } from "../../../../../shared/domain/Percentage";
import { Interface as IMonthlyEnvelopeRepo } from "../../repos/Interface";
import { Balance } from "../../../../../shared/domain/Balance";
import { AppError } from "../../../../../shared/core/AppError";
import { left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Id } from "../../../../../shared/domain/Id";
import { Name } from "../../../../../shared/domain/Name";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { CreateErrors } from "./CreateErrors";
import { CreateResponse } from "./CreateResponse";
import { CreateDTO } from "../../dtos";
import { Reference, MonthlyEnvelope } from "../../domain";


export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IMonthlyEnvelopeRepo;

  constructor(repo: IMonthlyEnvelopeRepo) {
    this.repo = repo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const balanceOrError = Balance.create({ balance: 0 });
    const referenceOrError = Reference.create({ reference: request.reference });
    const userIdOrError = Id.create(new UniqueEntityID(request.userId));
    const envelopeIdOrError = Id.create(new UniqueEntityID(request.envelopeId));
    const idOrError = Id.create(new UniqueEntityID());
    const percentageOrError = Percentage.create({ percentage: request.percentage });


    const dtoResult = Result.combine([
      referenceOrError, balanceOrError,userIdOrError, idOrError, percentageOrError,envelopeIdOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const id: Id = idOrError.getValue();
    const envelopeId: Id = envelopeIdOrError.getValue();
    const balance: Balance = balanceOrError.getValue();
    const reference: Reference = referenceOrError.getValue();
    const userId: Id = userIdOrError.getValue();
    const percentage: Percentage = percentageOrError.getValue();

    try {

      const MonthlyEnvelopeOrError: Result<MonthlyEnvelope> = MonthlyEnvelope.create({
        id,
        percentage,
        balance: balance,
        reference: reference,
        envelopeId: envelopeId,
      });

      if (MonthlyEnvelopeOrError.isFailure) {
        return left(
          Result.fail<MonthlyEnvelope>(MonthlyEnvelopeOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const envelope: MonthlyEnvelope = MonthlyEnvelopeOrError.getValue();

      await this.repo.create(envelope);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}