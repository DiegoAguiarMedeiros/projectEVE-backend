import { FixedExpenseDTO } from "../../../domain/dto/fixedExpense";
import { FixedExpense } from "../../../domain/entities/fixedExpense/FixedExpense";
import { Balance } from "../../../domain/shared/Balance";
import { Description } from "../../../domain/shared/Description";
import { Id } from "../../../domain/shared/Id";
import { PaymentDay } from "../../../domain/shared/PaymentDay";
import { Mapper } from "../Mapper";


export class FixedExpenseMap implements Mapper<FixedExpense> {
  public static toDTO(fixedExpense: FixedExpense): FixedExpenseDTO {
    return {
      id: fixedExpense.id.value,
      envelopeId: fixedExpense.envelopeId.value,
      description: fixedExpense.description.value,
      amount: fixedExpense.amount.value,
      paymentDay: fixedExpense.paymentDay.value,
    };
  }

  public static toDomain(raw: any): FixedExpense {

    const DescriptionOrError = Description.create({ description: raw.description });
    DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

    const AmountOrError = Balance.create({ balance: raw.amount });
    AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

    const ProfitabilityOrError = Balance.create({ balance: raw.profitability });
    ProfitabilityOrError.isFailure ? console.error(ProfitabilityOrError.getErrorValue()) : '';

    const EnvelopeIdOrError = Id.create(raw.envelope_id);
    EnvelopeIdOrError.isFailure ? console.error(EnvelopeIdOrError.getErrorValue()) : '';

    const IdOrError = Id.create(raw.id);
    IdOrError.isFailure ? console.error(IdOrError.getErrorValue()) : '';

    const PaymentDayOrError = PaymentDay.create({ paymentDay: raw.payment_day });
    PaymentDayOrError.isFailure ? console.error(PaymentDayOrError.getErrorValue()) : '';

    const fixedExpenseOrError = FixedExpense.create(
      {
        id: IdOrError.getValue(),
        envelopeId: EnvelopeIdOrError.getValue(),
        description: DescriptionOrError.getValue(),
        amount: AmountOrError.getValue(),
        paymentDay: PaymentDayOrError.getValue(),
      }
    );

    fixedExpenseOrError.isFailure ? console.error(fixedExpenseOrError.getErrorValue()) : '';

    return fixedExpenseOrError.getValue();
  }

  public static async toPersistence(fixedExpense: FixedExpense): Promise<any> {

    return {
      id: fixedExpense.id.value,
      envelope_id: fixedExpense.envelopeId.value,
      description: fixedExpense.description.value,
      amount: fixedExpense.amount.value,
      payment_day: fixedExpense.paymentDay.value,
    };
  }
}
