import { Color } from "../../../shared/domain/Color";
import { Id } from "../../../shared/domain/Id";
import { Name } from "../../../shared/domain/Name";
import { Mapper } from "../../../shared/mappers/Mapper";
import { BaseEnvelope } from "../domain/BaseEnvelope";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { BaseEnvelopesDTO } from "../../envelopes/dtos";
import { Balance } from "../../../shared/domain/Balance";
import { Percentage } from "../../../shared/domain/Percentage";



export class BaseEnvelopeMap implements Mapper<BaseEnvelope> {
  public static toDTO(envelope: BaseEnvelope): BaseEnvelopesDTO {
    return {
      name: envelope.name.value,
      color: envelope.color.value,
      order: envelope.order.value,
      percentage: envelope.percentage.value,
      id: envelope.id.toString(),
    };
  }

  public static toDomain(raw: any): BaseEnvelope {
    const NameOrError = Name.create({ name: raw.name });
    const ColorOrError = Color.create({ color: raw.color });
    const OrderOrError = Balance.create({ balance: raw.order });
    const PercentageOrError = Percentage.create({ percentage: raw.percentage ?? 0 });

    if (NameOrError.isFailure) {
      throw new Error('Invalid use name');
    }

    if (ColorOrError.isFailure) {
      throw new Error('Invalid use color');
    }
    if (OrderOrError.isFailure) {
      throw new Error('Invalid use order');
    }
    if (PercentageOrError.isFailure) {
      throw new Error('Invalid use percentage');
    }

    const baseEnvelopeOrError = BaseEnvelope.create(
      {
        name: NameOrError.getValue(),
        color: ColorOrError.getValue(),
        order: OrderOrError.getValue(),
        percentage: PercentageOrError.getValue(),
      }, new UniqueEntityID(raw.id));

    if (baseEnvelopeOrError.isFailure) {
      throw new Error('Failed to create base envelope');
    }
    return baseEnvelopeOrError.getValue();
  }

  public static async toPersistence(baseEnvelope: BaseEnvelope): Promise<any> {

    return {
      name: baseEnvelope.name.value,
      color: baseEnvelope.color.value,
      order: baseEnvelope.order.value,
      percentage: baseEnvelope.percentage.value,
      id: baseEnvelope.id.toString(),
    };
  }
}
