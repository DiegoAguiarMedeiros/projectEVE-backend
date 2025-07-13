
import { Interface as IGoalsRepo } from "../../repos/Interface";
import { Interface as IEnvelopeRepo } from "../../../envelopes/repos/Interface";
import { UseCase } from "../../../../shared/core/UseCase";
import { CreateResponse } from "./CreateResponse";
import { Goals } from "../../domain/Goals";
import { Balance } from "../../../../shared/domain/Balance";
import { Description } from "../../../../shared/domain/Description";
import { Id } from "../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { left, Result, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { Percentage } from "../../../../shared/domain/Percentage";
import { CreateErrors } from "./CreateErrors";
import { CreateDTO } from "../../dtos";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IGoalsRepo;
  private envelopeRepo: IEnvelopeRepo;

  constructor(repo: IGoalsRepo, envelopeRepo: IEnvelopeRepo) {
    this.repo = repo;
    this.envelopeRepo = envelopeRepo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {

    const envelope = await this.envelopeRepo.getByName('goals', request.userId);

    if (!envelope) {
      return left(new CreateErrors.EnvelopeNotFound('')) as CreateResponse;
    }

    const EnvelopeIdOrError = Id.create(new UniqueEntityID(envelope.id.toString()));
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const AmountTotalOrError = Balance.create({ balance: request.amountTotal });
    const PercentageOrError = Percentage.create({ percentage: request.percentage });

    const dtoResult = Result.combine([
      EnvelopeIdOrError, DescriptionOrError, AmountOrError, AmountTotalOrError, PercentageOrError
    ]);


    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const envelopeId: Id = EnvelopeIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const amountTotal: Balance = AmountTotalOrError.getValue();
    const percentage: Percentage = PercentageOrError.getValue();
    const deadline: Date = request.deadline;

    try {

      const goalsOrError: Result<Goals> = Goals.create({
        envelopeId,
        description,
        amount,
        amountTotal,
        percentage,
        deadline
      });

      if (goalsOrError.isFailure) {
        return left(
          Result.fail<Goals>(goalsOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const goals: Goals = goalsOrError.getValue();
      await this.repo.create(goals);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}