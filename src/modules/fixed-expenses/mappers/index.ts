
import { Percentage } from "../../../shared/domain/Percentage";
import { FixedExpense } from "../domain/FixedExpense";
import { Balance } from "../../../shared/domain/Balance";
import { Color } from "../../../shared/domain/Color";
import { Result } from "../../../shared/core/Result";
import { Description } from "../../../shared/domain/Description";
import { Id } from "../../../shared/domain/Id";
import { Name } from "../../../shared/domain/Name";
import { PaymentDay } from "../../../shared/domain/PaymentDay";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Mapper } from "../../../shared/mappers/Mapper";
import { FixedExpenseDTO } from "../dtos";


export class FixedExpenseMap implements Mapper<FixedExpense> {
  public static toDTO(fixedExpense: FixedExpense): FixedExpenseDTO {
    return {
      id: fixedExpense.id.toString(),
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

    const envelopeIdOrError = Id.create(new UniqueEntityID(raw.envelope_id));

    const envelopeId: Id = envelopeIdOrError.getValue();

    const PaymentDayOrError = PaymentDay.create({ paymentDay: raw.payment_day });
    PaymentDayOrError.isFailure ? console.error(PaymentDayOrError.getErrorValue()) : '';

    const fixedExpenseOrError = FixedExpense.create(
      {
        envelopeId: envelopeId,
        description: DescriptionOrError.getValue(),
        amount: AmountOrError.getValue(),
        paymentDay: PaymentDayOrError.getValue(),
      }, new UniqueEntityID(raw.id));

    fixedExpenseOrError.isFailure ? console.error(fixedExpenseOrError.getErrorValue()) : '';

    return fixedExpenseOrError.getValue();
  }

  public static async toPersistence(fixedExpense: FixedExpense): Promise<any> {

    return {
      id: fixedExpense.id.toString(),
      envelope_id: fixedExpense.envelopeId.value,
      description: fixedExpense.description.value,
      amount: fixedExpense.amount.value,
      payment_day: fixedExpense.paymentDay.value,
    };
  }
}
