import { Color } from "../../../../shared/domain/Color";
import { Id } from "../../../../shared/domain/Id";
import { Name } from "../../../../shared/domain/Name";
import { BaseEnvelopeDTO } from "../../envelope/dtos";
import { Mapper } from "../../../../shared/mappers/Mapper";
import { BaseEnvelope } from "../domain/BaseEnvelope";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";



export class BaseEnvelopeMap implements Mapper<BaseEnvelope> {
  public static toDTO(envelope: BaseEnvelope): BaseEnvelopeDTO {
    return {
      name: envelope.name.value,
      id: envelope.id.toString(),
    };
  }

  public static toDomain(raw: any): BaseEnvelope {
    const NameOrError = Name.create({ name: raw.name });
    const ColorOrError = Color.create({ color: raw.color });

    if (NameOrError.isFailure) {
      throw new Error('Invalid use name');
    }
    
    if (ColorOrError.isFailure) {
      throw new Error('Invalid use color');
    }

    const baseEnvelopeOrError = BaseEnvelope.create(
      {
        name: NameOrError.getValue(),
        color: ColorOrError.getValue(),
      }, new UniqueEntityID(raw.id));

    if (baseEnvelopeOrError.isFailure) {
      throw new Error('Failed to create base envelope');
    }
    return baseEnvelopeOrError.getValue();
  }

  public static async toPersistence(baseEnvelope: BaseEnvelope): Promise<any> {

    return {
      name: baseEnvelope.name.value,
      id: baseEnvelope.id.toString(),
    };
  }
}
