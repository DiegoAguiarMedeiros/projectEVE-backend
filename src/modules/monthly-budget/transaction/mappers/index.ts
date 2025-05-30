import { TransactionDTO } from "../dtos";
import { Percentage } from "../../../../shared/domain/Percentage";
import { Balance } from "../../../../shared/domain/Balance";
import { Color } from "../../../../shared/domain/Color";
import { Result } from "../../../../shared/core/Result";
import { Description } from "../../../../shared/domain/Description";
import { Id } from "../../../../shared/domain/Id";
import { Name } from "../../../../shared/domain/Name";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { EnvelopeMap } from "../../../budgeting/envelope/mappers";
import { Mapper } from "../../../../shared/mappers/Mapper";
import { Envelope } from "../../../budgeting/envelope/domain/Envelope";
import { Transaction } from "../domain";


export class TransactionMap implements Mapper<Transaction> {
  public static toDTO(transaction: Transaction): TransactionDTO {
    return {
      id: transaction.id.toString(),
      creditCardId: transaction.creditCardId?.value,
      envelope: transaction.envelope,
      description: transaction.description.value,
      amount: transaction.amount.value,
      paymentMethod: transaction.paymentMethod,
      date: transaction.date,
      type: transaction.type,
      status: transaction.status,
    };
  }

  public static toDomain(raw: any): Transaction {
    const DescriptionOrError = Description.create({ description: raw.description });
    DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

    const AmountOrError = Balance.create({ balance: raw.amount });
    AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

    const CreditCardIdOrError = Id.create(raw.credit_card_id);
    CreditCardIdOrError.isFailure ? console.error(CreditCardIdOrError.getErrorValue()) : '';

    const EnvelopeNameOrError = Name.create({ name: raw.Envelope.name });
    const userIdOrError = Id.create(new UniqueEntityID(raw.Envelope.userId));
    const EnvelopeColorOrError = Color.create({ color: raw.Envelope.color });
    const EnvelopePercentageOrError = Percentage.create({ percentage: raw.Envelope.percentage });


    const dtoResult = Result.combine([
      EnvelopeNameOrError, userIdOrError,   EnvelopeColorOrError, EnvelopePercentageOrError
    ]);

    if (dtoResult.isFailure) {
      console.error(dtoResult.getErrorValue())
    }

    const envelopeName: Name = EnvelopeNameOrError.getValue();
    const userId: Id = userIdOrError.getValue();
    const envelopeColor: Color = EnvelopeColorOrError.getValue();
    const envelopePercentage: Percentage = EnvelopePercentageOrError.getValue();


    const EnvelopeOrError = Envelope.create({
      name: envelopeName,
      color: envelopeColor,
      percentage: envelopePercentage,
      userId: userId,
    }, new UniqueEntityID(raw.envelope_id));
    

    const debtOrError = Transaction.create(
      {
        creditCardId: CreditCardIdOrError.getValue(),
        envelope: EnvelopeMap.toDTO(EnvelopeOrError.getValue()),
        description: DescriptionOrError.getValue(),
        amount: AmountOrError.getValue(),
        paymentMethod: raw.payment_method,
        date: raw.date,
        type: raw.type,
        status: raw.status,
      }, new UniqueEntityID(raw.id));

    debtOrError.isFailure ? console.error(debtOrError.getErrorValue()) : '';

    return debtOrError.getValue();
  }

  public static async toPersistence(transaction: Transaction): Promise<any> {

    return {
      id: transaction.id.toString(),
      credit_card_id: !transaction.creditCardId ? null : transaction.creditCardId?.value,
      envelope_id: transaction.envelope.id,
      description: transaction.description.value,
      amount: transaction.amount.value,
      payment_method: transaction.paymentMethod,
      date: transaction.date,
      status: transaction.status,
    };
  }
}
