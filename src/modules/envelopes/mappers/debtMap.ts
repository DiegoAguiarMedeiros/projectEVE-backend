import { Mapper } from "../../../shared/infra/Mapper";
import { Debt } from "../domain/debt";
import { DebtDTO } from "../dtos/debtDTO";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Name } from "../domain/name";
import { UserId } from "../domain/userId";
import { Id } from "../../../shared/domain/Id";
import { Balance } from "../domain/balance";
import { Flag } from "../domain/flag";
import { Description } from "../domain/description";

export class DebtMap implements Mapper<Debt> {
  public static toDTO(debt: Debt): DebtDTO {
    return {
      id: debt.id.value,
      userId: debt.userId.value,
      creditCardId: debt.creditCardId.value,
      envelopeId: debt.envelopeId.value,
      description: debt.description.value,
      amount: debt.amount.value,
      installments_total: debt.installments_total.value,
      installments_paid: debt.installments_paid.value,
      dueDate: debt.dueDate,
      status: debt.status,
    };
  }

  public static toDomain(raw: any): Debt {
    const DescriptionOrError = Description.create({ description: raw.description });
    DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

    const AmountOrError = Balance.create({ balance: raw.amount });
    AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

    const InstallmentsTotalOrError = Balance.create({ balance: raw.installments_total });
    InstallmentsTotalOrError.isFailure ? console.error(InstallmentsTotalOrError.getErrorValue()) : '';

    const InstallmentsPaidOrError = Balance.create({ balance: raw.installments_paid });
    InstallmentsPaidOrError.isFailure ? console.error(InstallmentsPaidOrError.getErrorValue()) : '';

    const UserIdOrError = Id.create(raw.user_id);
    UserIdOrError.isFailure ? console.error(UserIdOrError.getErrorValue()) : '';

    const IdOrError = Id.create(raw.id);
    IdOrError.isFailure ? console.error(IdOrError.getErrorValue()) : '';

    const CreditCardIdOrError = Id.create(raw.credit_card_id);
    CreditCardIdOrError.isFailure ? console.error(CreditCardIdOrError.getErrorValue()) : '';

    const EvelopeIdOrError = Id.create(raw.envelope_id);
    EvelopeIdOrError.isFailure ? console.error(EvelopeIdOrError.getErrorValue()) : '';

    const debtOrError = Debt.create(
      {
        id: IdOrError.getValue(),
        userId: UserIdOrError.getValue(),
        creditCardId: CreditCardIdOrError.getValue(),
        envelopeId: EvelopeIdOrError.getValue(),
        description: DescriptionOrError.getValue(),
        amount: AmountOrError.getValue(),
        installments_total: InstallmentsTotalOrError.getValue(),
        installments_paid: InstallmentsPaidOrError.getValue(),
        dueDate: raw.due_date,
        status: raw.status,
      }
    );

    debtOrError.isFailure ? console.error(debtOrError.getErrorValue()) : '';

    return debtOrError.getValue();
  }

  public static async toPersistence(debt: Debt): Promise<any> {

    return {
      id: debt.id.value,
      user_id: debt.userId.value,
      credit_card_id: debt.creditCardId.value,
      envelope_id: debt.envelopeId.value,
      description: debt.description.value,
      amount: debt.amount.value,
      installments_total: debt.installments_total.value,
      installments_paid: debt.installments_paid.value,
      due_date: debt.dueDate,
      status: debt.status,
    };
  }
}
