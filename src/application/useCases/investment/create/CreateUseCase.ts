
import { Interface as IInvestmentsRepo } from "../../../../domain/repositories/investment/Interface";
import { Interface as IEnvelopeRepo } from "../../../../domain/repositories/envelope/Interface";
import { CreateDTO } from "./CreateDTO";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { CreateResponse } from "./CreateResponse";
import { Debt } from "../../../../domain/entities/debt/Debt";
import { Investment } from "../../../../domain/entities/investment/Investment";
import { InvestmentsStatus } from "../../../../domain/entities/investment/InvestmentsStatus";
import { InvestmentsType } from "../../../../domain/entities/investment/InvestmentsType";
import { Balance } from "../../../../domain/shared/Balance";
import { Description } from "../../../../domain/shared/Description";
import { Id } from "../../../../domain/shared/Id";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";
import { EnvelopeMap } from "../../../../shared/mappers/envelope";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { AppError } from "../../../../domain/shared/core/AppError";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IInvestmentsRepo;
  private envelopeRepo: IEnvelopeRepo;

  constructor(repo: IInvestmentsRepo, envelopeRepo: IEnvelopeRepo) {
    this.repo = repo;
    this.envelopeRepo = envelopeRepo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const ProfitabilityOrError = Balance.create({ balance: request.profitability });
    const IdOrError = Id.create(new UniqueEntityID());
    const envelopeRaw = await this.envelopeRepo.getByName('Investimentos', request.userId)

    if (!envelopeRaw) {
      return left(Result.fail<void>(`The envelope was not found`))
    }
    const envelope = EnvelopeMap.toDomain(envelopeRaw);

    const EnvelopeIdOrError = Id.create(new UniqueEntityID(envelope.id.value));
    const dtoResult = Result.combine([
      DescriptionOrError, AmountOrError, EnvelopeIdOrError, IdOrError, ProfitabilityOrError
    ]);


    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }




    const id: Id = IdOrError.getValue();
    const envelopeId: Id = EnvelopeIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const profitability: Balance = ProfitabilityOrError.getValue();
    const applicationDate: Date = request.applicationDate;
    const maturityDate: Date = request.maturityDate;
    const status: InvestmentsStatus = request.status;
    const type: InvestmentsType = request.type;

    try {

      const investmentsOrError: Result<Investment> = Investment.create({
        id,
        envelopeId,
        description,
        amount,
        profitability,
        applicationDate,
        maturityDate,
        status,
        type
      });

      if (investmentsOrError.isFailure) {
        return left(
          Result.fail<Debt>(investmentsOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const investment: Investment = investmentsOrError.getValue();
      await this.repo.create(investment);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}