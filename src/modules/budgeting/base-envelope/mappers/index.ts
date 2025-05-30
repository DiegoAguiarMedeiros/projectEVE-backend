import { Color } from "../../../../shared/domain/Color";
import { Id } from "../../../../shared/domain/Id";
import { Name } from "../../../../shared/domain/Name";
import { BaseEnvelopeDTO } from "../../envelope/dtos";
import { Mapper } from "../../../../shared/mappers/Mapper";
import { BaseEnvelope } from "../domain/BaseEnvelope";



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
