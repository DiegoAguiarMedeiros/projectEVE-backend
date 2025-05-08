import { TransactionDTO } from "../../../domain/dto/transaction";
import { Envelope } from "../../../domain/entities/envelope/Envelope";
import { Percentage } from "../../../domain/entities/envelope/Percentage";
import { Transaction } from "../../../domain/entities/transaction/Transaction";
import { Balance } from "../../../domain/shared/Balance";
import { Color } from "../../../domain/shared/Color";
import { Result } from "../../../domain/shared/core/Result";
import { Description } from "../../../domain/shared/Description";
import { Id } from "../../../domain/shared/Id";
import { Name } from "../../../domain/shared/Name";
import { UniqueEntityID } from "../../../domain/shared/UniqueEntityID";
import { EnvelopeMap } from "../envelope";
import { Mapper } from "../Mapper";


export class TransactionMap implements Mapper<Transaction> {
  public static toDTO(transaction: Transaction): TransactionDTO {
    return {
      id: transaction.id.value,
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

    const IdOrError = Id.create(raw.id);
    IdOrError.isFailure ? console.error(IdOrError.getErrorValue()) : '';

    const CreditCardIdOrError = Id.create(raw.credit_card_id);
    CreditCardIdOrError.isFailure ? console.error(CreditCardIdOrError.getErrorValue()) : '';

    const EvelopeIdOrError = Id.create(raw.Envelope.id);
    EvelopeIdOrError.isFailure ? console.error(EvelopeIdOrError.getErrorValue()) : '';

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

    const debtOrError = Transaction.create(
      {
        id: IdOrError.getValue(),
        creditCardId: CreditCardIdOrError.getValue(),
        envelope: EnvelopeMap.toDTO(EnvelopeOrError.getValue()),
        description: DescriptionOrError.getValue(),
        amount: AmountOrError.getValue(),
        paymentMethod: raw.payment_method,
        date: raw.date,
        type: raw.type,
        status: raw.status,
      }
    );

    debtOrError.isFailure ? console.error(debtOrError.getErrorValue()) : '';

    return debtOrError.getValue();
  }

  public static async toPersistence(transaction: Transaction): Promise<any> {

    return {
      id: transaction.id.value,
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
