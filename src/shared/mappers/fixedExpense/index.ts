import { FixedExpenseDTO } from "../../../domain/dto/fixedExpense";
import { Envelope } from "../../../domain/entities/envelope/Envelope";
import { Percentage } from "../../../domain/entities/envelope/Percentage";
import { FixedExpense } from "../../../domain/entities/fixedExpense/FixedExpense";
import { Balance } from "../../../domain/shared/Balance";
import { Color } from "../../../domain/shared/Color";
import { Result } from "../../../domain/shared/core/Result";
import { Description } from "../../../domain/shared/Description";
import { Id } from "../../../domain/shared/Id";
import { Name } from "../../../domain/shared/Name";
import { PaymentDay } from "../../../domain/shared/PaymentDay";
import { UniqueEntityID } from "../../../domain/shared/UniqueEntityID";
import { EnvelopeMap } from "../envelope";
import { Mapper } from "../Mapper";


export class FixedExpenseMap implements Mapper<FixedExpense> {
  public static toDTO(fixedExpense: FixedExpense): FixedExpenseDTO {
    return {
      id: fixedExpense.id.value,
      envelope: fixedExpense.envelope,
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

    const EnvelopeNameOrError = Name.create({ name: raw.Envelope.name });
    const EnvelopeBalanceOrError = Balance.create({ balance: raw.Envelope.balance });
    const userIdOrError = Id.create(new UniqueEntityID(raw.Envelope.userId));
    const EnvelopeIdOrError = Id.create(new UniqueEntityID(raw.Envelope.id));
    const EnvelopeColorOrError = Color.create({ color: raw.Envelope.color });
    const EnvelopePercentageOrError = Percentage.create({ percentage: raw.Envelope.percentage });

    const dtoResult = Result.combine([
      EnvelopeNameOrError, userIdOrError, EnvelopeIdOrError, EnvelopeBalanceOrError, EnvelopeColorOrError, EnvelopePercentageOrError
    ]);

    if (dtoResult.isFailure) {
      console.error(dtoResult.getErrorValue())
    }



    const envelopeId: Id = EnvelopeIdOrError.getValue();
    const envelopeName: Name = EnvelopeNameOrError.getValue();
    const envelopeBalance: Balance = EnvelopeBalanceOrError.getValue();
    const userId: Id = userIdOrError.getValue();
    const envelopeColor: Color = EnvelopeColorOrError.getValue();
    const envelopePercentage: Percentage = EnvelopePercentageOrError.getValue();

    const EnvelopeOrError = Envelope.create({
      id: envelopeId,
      name: envelopeName,
      balance: envelopeBalance,
      color: envelopeColor,
      percentage: envelopePercentage,
      active: raw.Envelope.active,
      is_editable: raw.Envelope.is_editable,
      userId: userId,
    });
    EnvelopeIdOrError.isFailure ? console.error(EnvelopeIdOrError.getErrorValue()) : '';

    const IdOrError = Id.create(raw.id);
    IdOrError.isFailure ? console.error(IdOrError.getErrorValue()) : '';

    const PaymentDayOrError = PaymentDay.create({ paymentDay: raw.payment_day });
    PaymentDayOrError.isFailure ? console.error(PaymentDayOrError.getErrorValue()) : '';

    const fixedExpenseOrError = FixedExpense.create(
      {
        id: IdOrError.getValue(),
        envelope: EnvelopeMap.toDTO(EnvelopeOrError.getValue()),
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
      envelope_id: fixedExpense.envelope.id,
      description: fixedExpense.description.value,
      amount: fixedExpense.amount.value,
      payment_day: fixedExpense.paymentDay.value,
    };
  }
}
