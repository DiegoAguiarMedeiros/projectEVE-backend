import { BaseEnvelopeDTO } from "../../../domain/dto/envelope";
import { BaseEnvelope } from "../../../domain/entities/baseEnvelope/BaseEnvelope";
import { Color } from "../../../domain/shared/Color";
import { Id } from "../../../domain/shared/Id";
import { Name } from "../../../domain/shared/Name";
import { Mapper } from "../Mapper";


export class BaseEnvelopeMap implements Mapper<BaseEnvelope> {
  public static toDTO(envelope: BaseEnvelope): BaseEnvelopeDTO {
    return {
      name: envelope.name.value,
      id: envelope.id.value,
    };
  }

  public static toDomain(raw: any): BaseEnvelope {
    const NameOrError = Name.create({ name: raw.name });
    const IdOrError = Id.create(raw.userId);
    const ColorOrError = Color.create({ color: raw.color });

    if (NameOrError.isFailure) {
      throw new Error('Invalid use name');
    }
    if (IdOrError.isFailure) {
      throw new Error('Invalid use id');
    }
    
    if (ColorOrError.isFailure) {
      throw new Error('Invalid use color');
    }

    const userOrError = BaseEnvelope.create(
      {
        name: NameOrError.getValue(),
        color: ColorOrError.getValue(),
        id: IdOrError.getValue(),
      }
    );

    if (userOrError.isFailure) {
      throw new Error('Failed to create user');
    }
    return userOrError.getValue();
  }

  public static async toPersistence(baseEnvelope: BaseEnvelope): Promise<any> {

    return {
      name: baseEnvelope.name.value,
      id: baseEnvelope.id.value,
    };
  }
}
