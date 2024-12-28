import { Mapper } from "../../../shared/infra/Mapper";
import { BaseEnvelope } from "../domain/baseEnvelope";
import { BaseEnvelopeDTO } from "../dtos/envelopeDTO";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Name } from "../domain/name";
import { UserId } from "../domain/userId";
import { Id } from "../../../shared/domain/Id";

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
    if (NameOrError.isFailure) {
      throw new Error('Invalid use name');
    }
    if (IdOrError.isFailure) {
      throw new Error('Invalid use id');
    }

    const userOrError = BaseEnvelope.create(
      {
        name: NameOrError.getValue(),
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
