import { TransactionDTO } from "../../../domain/dto/transaction";
import { Transaction } from "../../../domain/entities/transaction/Transaction";
import { Balance } from "../../../domain/shared/Balance";
import { Description } from "../../../domain/shared/Description";
import { Id } from "../../../domain/shared/Id";
import { Mapper } from "../Mapper";


export class TransactionMap implements Mapper<Transaction> {
  public static toDTO(transaction: Transaction): TransactionDTO {
    return {
      id: transaction.id.value,
      creditCardId: transaction.creditCardId?.value,
      envelopeId: transaction.envelopeId.value,
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

    const EvelopeIdOrError = Id.create(raw.envelope_id);
    EvelopeIdOrError.isFailure ? console.error(EvelopeIdOrError.getErrorValue()) : '';

    const debtOrError = Transaction.create(
      {
        id: IdOrError.getValue(),
        creditCardId: CreditCardIdOrError.getValue(),
        envelopeId: EvelopeIdOrError.getValue(),
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
      credit_card_id: !transaction.creditCardId ? null :transaction.creditCardId?.value,
      envelope_id: transaction.envelopeId.value,
      description: transaction.description.value,
      amount: transaction.amount.value,
      payment_method: transaction.paymentMethod,
      date: transaction.date,
      status: transaction.status,
    };
  }
}
