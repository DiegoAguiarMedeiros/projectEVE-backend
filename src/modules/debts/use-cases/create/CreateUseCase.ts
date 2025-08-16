
import { Interface as IDebtRepo } from "../../repos/Interface";
import { Interface as IEnvelopeRepo } from "../../../envelopes/repos/Interface";
import { Balance } from "../../../../shared/domain/Balance";
import { Description } from "../../../../shared/domain/Description";
import { Id } from "../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { AppError } from "../../../../shared/core/AppError";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { CreateResponse } from "./CreateResponse";
import { PaymentDay } from "../../../../shared/domain/PaymentDay";
import { CreateDTO } from "../../dtos";
import { DebtsStatus, Debt } from "../../domain";
import { CreateErrors } from "./CreateErrors";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private debtRepo: IDebtRepo;
  private envelopeRepo: IEnvelopeRepo;

  constructor(debtRepo: IDebtRepo, envelopeRepo: IEnvelopeRepo) {
    this.debtRepo = debtRepo;
    this.envelopeRepo = envelopeRepo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {


    const envelope = await this.envelopeRepo.getById(request.envelopeId, request.userId);

    if (!envelope) {
      return left(new CreateErrors.EnvelopeNotFound(request.envelopeId)) as CreateResponse;
    }

    const EnvelopeIdOrError = Id.create(new UniqueEntityID(request.envelopeId));
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const InstallmentsTotalOrError = Balance.create({ balance: request.installmentsTotal });
    const InstallmentsPaidOrError = Balance.create({ balance: request.installmentsPaid });

    const PaymentDayOrError = PaymentDay.create({ paymentDay: request.paymentDay });
    const dtoResult = Result.combine([
      EnvelopeIdOrError, DescriptionOrError, AmountOrError, InstallmentsTotalOrError, InstallmentsPaidOrError, PaymentDayOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const envelopeId: Id = EnvelopeIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const installmentsTotal: Balance = InstallmentsTotalOrError.getValue();
    const installmentsPaid: Balance = InstallmentsPaidOrError.getValue();
    const paymentDay: PaymentDay = PaymentDayOrError.getValue();

    const status: DebtsStatus = request.status;

    try {

      const debtOrError: Result<Debt> = Debt.create({
        description,
        amount,
        installmentsTotal,
        installmentsPaid,
        paymentDay,
        envelopeId,
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