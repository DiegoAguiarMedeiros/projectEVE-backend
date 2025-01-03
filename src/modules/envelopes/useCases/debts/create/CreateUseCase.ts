
import { CreateDTO } from "./CreateDTO";
import { Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { IDebtRepo } from "../../../repos/DebtsRepo";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Id } from "../../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { CreateResponse } from "./CreateResponse";
import { Debt } from "../../../domain/debt";
import { Description } from "../../../domain/description";
import { DebtsStatus } from "../../../domain/debtsStatus";
import { Balance } from "../../../domain/balance";

export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private debtRepo: IDebtRepo;

  constructor(debtRepo: IDebtRepo) {
    this.debtRepo = debtRepo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const DescriptionOrError = Description.create({ description: request.description });
    const AmountOrError = Balance.create({ balance: request.amount });
    const InstallmentsTotalOrError = Balance.create({ balance: request.installments_total });
    const InstallmentsPaidOrError = Balance.create({ balance: request.installments_paid });
    const UserIdOrError = Id.create(new UniqueEntityID(request.userId));
    const IdOrError = Id.create(new UniqueEntityID());
    const CreditCardIdOrError = Id.create(new UniqueEntityID(request.creditCardId));
    const EvelopeIdOrError = Id.create(new UniqueEntityID(request.envelopeId));

    const dtoResult = Result.combine([
      DescriptionOrError, AmountOrError, UserIdOrError, IdOrError, CreditCardIdOrError, EvelopeIdOrError, InstallmentsTotalOrError, InstallmentsPaidOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const id: Id = IdOrError.getValue();
    const userId: Id = UserIdOrError.getValue();
    const creditCardId: Id = CreditCardIdOrError.getValue();
    const envelopeId: Id = EvelopeIdOrError.getValue();
    const description: Description = DescriptionOrError.getValue();
    const amount: Balance = AmountOrError.getValue();
    const installments_total: Balance = InstallmentsTotalOrError.getValue();
    const installments_paid: Balance = InstallmentsPaidOrError.getValue();
    const dueDate: Date = request.dueDate;
    const status: DebtsStatus = request.status;

    try {

      const debtOrError: Result<Debt> = Debt.create({
        id,
        userId,
        creditCardId,
        envelopeId,
        description,
        amount,
        installments_total,
        installments_paid,
        dueDate,
        status,
      });

      if (debtOrError.isFailure) {
        return left(
          Result.fail<Debt>(debtOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const debt: Debt = debtOrError.getValue();

      await this.debtRepo.save(debt);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}