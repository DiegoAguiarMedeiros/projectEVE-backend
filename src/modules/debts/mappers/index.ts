import { DebtDTO } from "../dtos";
import { Balance } from "../../../shared/domain/Balance";
import { Description } from "../../../shared/domain/Description";
import { Id } from "../../../shared/domain/Id";
import { PaymentDay } from "../../../shared/domain/PaymentDay";
import { Mapper } from "../../../shared/mappers/Mapper";
import { Debt } from "../domain";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";

export class DebtMap implements Mapper<Debt> {
  public static toDTO(debt: Debt): DebtDTO {
    return {
      id: debt.id.toString(),
      description: debt.description.value,
      amount: debt.amount.value,
      installmentsTotal: debt.installmentsTotal.value,
      installmentsPaid: debt.installmentsPaid.value,
      paymentDay: debt.paymentDay.value,
      envelopeId: debt.envelopeId.value,
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

    const PaymentDayOrError = PaymentDay.create({ paymentDay: raw.payment_day });
    PaymentDayOrError.isFailure ? console.error(PaymentDayOrError.getErrorValue()) : '';

    const EnvelopeIdOrError = Id.create(new UniqueEntityID(raw.envelope_id));
    EnvelopeIdOrError.isFailure ? console.error(EnvelopeIdOrError.getErrorValue()) : '';


    const debtOrError = Debt.create(
      {
        description: DescriptionOrError.getValue(),
        amount: AmountOrError.getValue(),
        installmentsTotal: InstallmentsTotalOrError.getValue(),
        installmentsPaid: InstallmentsPaidOrError.getValue(),
        paymentDay: PaymentDayOrError.getValue(),
        envelopeId: EnvelopeIdOrError.getValue(),
        status: raw.status,
      }, new UniqueEntityID(raw.id));

    debtOrError.isFailure ? console.error(debtOrError.getErrorValue()) : '';

    return debtOrError.getValue();
  }

  public static async toPersistence(debt: Debt): Promise<any> {
    console.log("toPersistence debt",debt)
    return {
      id: debt.id.toString(),
      description: debt.description.value,
      amount: debt.amount.value,
      installments_total: debt.installmentsTotal.value,
      installments_paid: debt.installmentsPaid.value,
      payment_day: debt.paymentDay.value,
      envelope_id: debt.envelopeId.value,
      status: debt.status,
    };
  }
}
