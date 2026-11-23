import { TransactionsDTO } from "../dtos";
import { Percentage } from "../../../shared/domain/Percentage";
import { Balance } from "../../../shared/domain/Balance";
import { Color } from "../../../shared/domain/Color";
import { Result } from "../../../shared/core/Result";
import { Description } from "../../../shared/domain/Description";
import { Id } from "../../../shared/domain/Id";
import { Name } from "../../../shared/domain/Name";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Mapper } from "../../../shared/mappers/Mapper";
import { Transactions } from "../domain";
import { MONTHS } from "../../../shared/constants/months";


export class TransactionsMap implements Mapper<Transactions> {

  public static toAnalyticsEnvelopesByYear(data: any[]): number[] {
    const rowMap = new Map(data.map(r => [Number(r.month), Number(r.amount)]));
    return MONTHS.map((_, index) => rowMap.get(index + 1) ?? 0);
  }

  public static toDTO(transactions: Transactions): TransactionsDTO {
    return {
      id: transactions.id.toString(),
      description: transactions.description.value,
      envelopeId: transactions.envelopeId.value,
      creditCardId: transactions.creditCardId?.value,
      creditCardName: transactions.creditCardName,
      processedIncomesId: transactions.processedIncomesId?.value,
      debtId: transactions.debtId?.value,
      amount: transactions.amount.value,
      date: transactions.date,
      referenceYear: transactions.referenceYear,
      referenceMonth: transactions.referenceMonth,
      type: transactions.type,
      status: transactions.status,
      paymentMethod: transactions.paymentMethod,
      isTranslatable: transactions.isTranslatable,
    };
  }

  public static toDomain(raw: any): Transactions {
    const ProcessedIncomesIdOrError = Id.create(new UniqueEntityID(raw.processed_incomes_id));
    ProcessedIncomesIdOrError.isFailure ? console.error(ProcessedIncomesIdOrError.getErrorValue()) : '';

    const EnvelopeIdOrError = Id.create(new UniqueEntityID(raw.envelope_id));
    EnvelopeIdOrError.isFailure ? console.error(EnvelopeIdOrError.getErrorValue()) : '';

    const CreditCardIdOrError = raw.credit_card_id ? Id.create(new UniqueEntityID(raw.credit_card_id)) : null;
    const DebtIdOrError = raw.debt_id ? Id.create(new UniqueEntityID(raw.debt_id)) : null;

    const DescriptionOrError = Description.create({ description: raw.description });
    DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

    const AmountOrError = Balance.create({ balance: raw.amount });
    AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

    const parsedDate = typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date)
      ? new Date(`${raw.date}T12:00:00`)
      : new Date(raw.date);

    const debtOrError = Transactions.create(
      {
        processedIncomesId: raw.processed_incomes_id ? ProcessedIncomesIdOrError.getValue() : undefined,
        creditCardId: CreditCardIdOrError ? CreditCardIdOrError.getValue() : undefined,
        creditCardName: raw.credit_card_name ?? undefined,
        debtId: DebtIdOrError ? DebtIdOrError.getValue() : undefined,
        envelopeId: EnvelopeIdOrError.getValue(),
        description: DescriptionOrError.getValue(),
        amount: AmountOrError.getValue(),
        date: parsedDate,
        referenceYear: raw.reference_year != null ? Number(raw.reference_year) : parsedDate.getFullYear(),
        referenceMonth: raw.reference_month != null ? Number(raw.reference_month) : parsedDate.getMonth() + 1,
        type: raw.type,
        status: raw.status,
        paymentMethod: raw.payment_method,
        isTranslatable: raw.is_translatable,
      }, new UniqueEntityID(raw.id));

    debtOrError.isFailure ? console.error(debtOrError.getErrorValue()) : '';

    return debtOrError.getValue();
  }

  public static async toPersistence(transactions: Transactions): Promise<any> {

    return {
      id: transactions.id.toString(),
      description: transactions.description.value,
      amount: transactions.amount.value,
      date: transactions.date,
      reference_year: transactions.referenceYear,
      reference_month: transactions.referenceMonth,
      status: transactions.status,
      type: transactions.type,
      payment_method: transactions.paymentMethod,
      envelope_id: transactions.envelopeId.value,
      credit_card_id: transactions.creditCardId?.value ?? null,
      processed_incomes_id: transactions.processedIncomesId?.value ?? null,
      debt_id: transactions.debtId?.value ?? null,
      is_translatable: transactions.isTranslatable,
    };
  }
}
