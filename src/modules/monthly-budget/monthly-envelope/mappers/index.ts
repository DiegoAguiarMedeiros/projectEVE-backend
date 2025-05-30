import { MonthlyEnvelopeDTO } from "../dtos";
import { Percentage } from "../../../../shared/domain/Percentage";
import { Balance } from "../../../../shared/domain/Balance";
import { Id } from "../../../../shared/domain/Id";
import { Mapper } from "../../../../shared/mappers/Mapper";
import { MonthlyEnvelope, Reference } from "../domain";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";


export class MonthlyEnvelopeMap implements Mapper<MonthlyEnvelope> {
  public static toDTO(envelope: MonthlyEnvelope): MonthlyEnvelopeDTO {
    return {
      id: envelope.id.toString(),
      balance: envelope.balance.value,
      percentage: envelope.percentage.value,
      reference: envelope.reference.value,
      envelopeId: envelope.envelopeId.toString(),
    };
  }

  public static toDomain(raw: any): MonthlyEnvelope {
    const EnvelopeIdOrError = Id.create(raw.envelope_id);
    const TransactionIdOrError = Id.create(raw.transaction);
    const BalanceOrError = Balance.create({ balance: raw.balance });
    const PercentageOrError = Percentage.create({ percentage: raw.percentage });
    const ReferenceOrError = Reference.create({ reference: raw.reference });


    if (EnvelopeIdOrError.isFailure) {
      throw new Error('Invalid use EnvelopeId');
    }
    if (TransactionIdOrError.isFailure) {
      throw new Error('Invalid use TransactionId');
    }
    if (BalanceOrError.isFailure) {
      throw new Error('Invalid use balance');
    }
    if (PercentageOrError.isFailure) {
      throw new Error('Invalid use Percentage');
    }
    if (ReferenceOrError.isFailure) {
      throw new Error('Invalid use Reference');
    }
    const envelopeOrError = MonthlyEnvelope.create(
      {
        reference: ReferenceOrError.getValue(),
        envelopeId: EnvelopeIdOrError.getValue(),
        percentage: PercentageOrError.getValue(),
        balance: BalanceOrError.getValue(),
      }, new UniqueEntityID(raw.id));

    if (envelopeOrError.isFailure) {
      throw new Error('Failed to create envelope');
    }
    return envelopeOrError.getValue();
  }

  public static async toPersistence(data: MonthlyEnvelope): Promise<any> {

    return {
      id: data.id.toString(),
      envelope_id: data.envelopeId.toString(),
      balance: data.balance.value,
      percentage: data.percentage.value,
      reference: data.reference.value,
    };
  }
}
