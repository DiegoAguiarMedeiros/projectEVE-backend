
import { CreateDTO } from "./CreateDTO";
import { Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { IInvestmentsRepo } from "../../../repos/InvestmentsRepo";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Id } from "../../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { CreateResponse } from "./CreateResponse";
import { Debt } from "../../../domain/debt";
import { Description } from "../../../domain/description";
import { DebtsStatus } from "../../../domain/debtsStatus";
import { Balance } from "../../../domain/balance";
import { Investments } from "../../../domain/investments";
import { InvestmentsStatus } from "../../../domain/investmentsStatus";
import { InvestmentsType } from "../../../domain/investmentsType";
import { GetByIdUseCase } from "../../envelopes/getById/GetByIdUseCase";
import { Envelope } from "../../../domain/envelope";
import { EnvelopeMap } from "../../../mappers/envelopeMap";
import { IEnvelopeRepo } from "../../../repos/EnvelopeRepo";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IInvestmentsRepo;
  private envelopeRepo: IEnvelopeRepo;

  constructor(repo: IInvestmentsRepo,envelopeRepo: IEnvelopeRepo) {
    this.repo = repo;
    this.envelopeRepo = envelopeRepo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const ProfitabilityOrError = Balance.create({ balance: request.profitability });
    const IdOrError = Id.create(new UniqueEntityID());
    const envelopeRaw= await this.envelopeRepo.getByName('Dívidas',request.userId)
    
    if (!envelopeRaw) {
      return left(Result.fail<void>(`The envelope was not found`))
    }
    const envelope = EnvelopeMap.toDomain(envelopeRaw);

    const EnvelopeIdOrError = Id.create(new UniqueEntityID(envelope.id.value));
    const dtoResult = Result.combine([
      DescriptionOrError, AmountOrError, EnvelopeIdOrError, IdOrError,ProfitabilityOrError
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

      const investmentsOrError: Result<Investments> = Investments.create({
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

      const investment: Investments = investmentsOrError.getValue();
      console.log("investment",investment)
      await this.repo.save(investment);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}