
import { Debt } from "../../../../domain/entities/debt/Debt";
import { DebtsStatus } from "../../../../domain/entities/debt/DebtsStatus";
import { Interface as IDebtRepo} from "../../../../domain/repositories/debt/Interface";
import { Interface as IEnvelopeRepo} from "../../../../domain/repositories/envelope/Interface";
import { Balance } from "../../../../domain/shared/Balance";
import { Description } from "../../../../domain/shared/Description";
import { Id } from "../../../../domain/shared/Id";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";
import { EnvelopeMap } from "../../../../shared/mappers/envelope";
import { AppError } from "../../../../domain/shared/core/AppError";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { CreateDTO } from "./CreateDTO";
import { CreateResponse } from "./CreateResponse";
import { PaymentDay } from "../../../../domain/shared/PaymentDay";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private debtRepo: IDebtRepo;
  private envelopeRepo: IEnvelopeRepo;

  constructor(debtRepo: IDebtRepo,envelopeRepo: IEnvelopeRepo) {
    this.debtRepo = debtRepo;
    this.envelopeRepo = envelopeRepo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const InstallmentsTotalOrError = Balance.create({ balance: request.installmentsTotal });
    const InstallmentsPaidOrError = Balance.create({ balance: request.installmentsPaid });
    const IdOrError = Id.create(new UniqueEntityID());
    
    
    const envelopeRaw= await this.envelopeRepo.getByName('Dívidas',request.userId)
    
    if (!envelopeRaw) {
      return left(Result.fail<void>(`The envelope was not found`))
    }
    const envelope = EnvelopeMap.toDomain(envelopeRaw);
    const EnvelopeIdOrError = Id.create(new UniqueEntityID(envelope.id.value));

    const PaymentDayOrError = PaymentDay.create({ paymentDay: request.paymentDay });
    const dtoResult = Result.combine([
      DescriptionOrError, AmountOrError, IdOrError,EnvelopeIdOrError,  InstallmentsTotalOrError, InstallmentsPaidOrError,PaymentDayOrError
    ]);
    
    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }
    
    const id: Id = IdOrError.getValue();
    const envelopeId: Id = EnvelopeIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const installmentsTotal: Balance = InstallmentsTotalOrError.getValue();
    const installmentsPaid: Balance = InstallmentsPaidOrError.getValue();
    const paymentDay: PaymentDay = PaymentDayOrError.getValue();

    const status: DebtsStatus = request.status;

    try {

      const debtOrError: Result<Debt> = Debt.create({
        id,
        envelopeId,
        description,
        amount,
        installmentsTotal,
        installmentsPaid,
        paymentDay,
        status,
      });

      if (debtOrError.isFailure) {
        return left(
          Result.fail<Debt>(debtOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const debt: Debt = debtOrError.getValue();
      await this.debtRepo.create(debt);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}