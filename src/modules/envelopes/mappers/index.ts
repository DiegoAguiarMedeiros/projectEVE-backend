import { EnvelopesDTO } from "../dtos";
import { Percentage } from "../../../shared/domain/Percentage";
import { Color } from "../../../shared/domain/Color";
import { Id } from "../../../shared/domain/Id";
import { Name } from "../../../shared/domain/Name";
import { Mapper } from "../../../shared/mappers/Mapper";
import { Envelopes } from "../domain/Envelopes";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Balance } from "../../../shared/domain/Balance";
import { AnalyticsCurrentEnvelopesDTO } from "../../graph/dtos";
import { MONTHS } from "../../../shared/constants/months";


export class EnvelopesMap implements Mapper<Envelopes> {

  public static toAnalyticsCurrentEnvelopesDTO(raw: any): AnalyticsCurrentEnvelopesDTO {
    const result = raw.reduce(
      (
        acc: { labels: string[]; colors: string[]; subValues: number[]; values: number[]; },
        item: { name: any; color: any; 'envelope_amount': any; 'total_amount': any }
      ) => {
        const sub = parseFloat(item['envelope_amount'] ?? '0');
        const val = parseFloat(item['total_amount'] ?? '0');

        acc.labels.push(String(item.name));
        acc.colors.push(String(item.color));
        acc.values.push(val);

        const usedPercent = val > 0 ? ((val - sub) / val) * 100 : 0;
        acc.subValues.push(Number(usedPercent.toFixed(2)));
        return acc;
      },
      { labels: [], colors: [], subValues: [], values: [], usagePercentages: [] }
    );

    return {
      labels: result.labels,
      colors: result.colors,
      subValues: result.subValues,
      values: result.values,
    };
  }


  public static toDTO(envelope: Envelopes): EnvelopesDTO {
    return {
      id: envelope.id.toString(),
      name: envelope.name.value,
      color: envelope.color.value,
      order: envelope.order.value,
      amount: envelope.amount?.value,
      userId: envelope.userId.value,
      percentage: envelope.percentage.value,
      used: envelope.used?.value,
    };
  }

  public static toDomain(raw: any): Envelopes {
    const NameOrError = Name.create({ name: raw.name });
    const UserIdOrError = Id.create(raw.user_id);
    const ColorOrError = Color.create({ color: raw.color });
    const OrderOrError = Balance.create({ balance: raw.order });
    const AmountOrError = Balance.create({ balance: raw.EnvelopesAmounts?.length > 0 ? raw.EnvelopesAmounts[0].amount : 0 });
    const PercentageOrError = Percentage.create({ percentage: raw.percentage });


    if (NameOrError.isFailure) {
      throw new Error('Invalid use name');
    }
    if (UserIdOrError.isFailure) {
      throw new Error('Invalid use id');
    }
    if (ColorOrError.isFailure) {
      throw new Error('Invalid use color');
    }
    if (OrderOrError.isFailure) {
      throw new Error('Invalid use order');
    }
    if (PercentageOrError.isFailure) {
      throw new Error('Invalid use Percentage');
    }

    const envelopeOrError = Envelopes.create(
      {
        name: NameOrError.getValue(),
        userId: UserIdOrError.getValue(),
        color: ColorOrError.getValue(),
        order: OrderOrError.getValue(),
        amount: AmountOrError.getValue(),
        percentage: PercentageOrError.getValue(),
      }, new UniqueEntityID(raw.id));

    if (envelopeOrError.isFailure) {
      throw new Error('Failed to create envelope');
    }
    return envelopeOrError.getValue();
  }

  public static async toPersistence(envelope: Envelopes): Promise<any> {

    return {
      id: envelope.id.toString(),
      name: envelope.name.value,
      color: envelope.color.value,
      order: envelope.order.value,
      percentage: envelope.percentage.value,
      user_id: envelope.userId.value,
    };
  }
}
