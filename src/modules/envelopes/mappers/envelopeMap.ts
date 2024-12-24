import { Mapper } from "../../../shared/infra/Mapper";
import { Envelope } from "../domain/envelope";
import { EnvelopeDTO } from "../dtos/envelopeDTO";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Name } from "../domain/name";
import { UserId } from "../domain/userId";

export class EnvelopeMap implements Mapper<Envelope> {
  public static toDTO(envelope: Envelope): EnvelopeDTO {
    return {
      name: envelope.name.value,
      userId: envelope.userId.value,
    };
  }

  public static toDomain(raw: any): Envelope {
    const NameOrError = Name.create({ name: raw.name });
    const UserIdOrError = UserId.create({ userId: raw.userId });
    if (NameOrError.isFailure) {
      throw new Error('Invalid use name');
    }
    if (UserIdOrError.isFailure) {
      throw new Error('Invalid use id');
    }

    const userOrError = Envelope.create(
      {
        name: NameOrError.getValue(),
        userId: UserIdOrError.getValue(),
      },
      new UniqueEntityID(raw.base_user_id)
    );

    if (userOrError.isFailure) {
      throw new Error('Failed to create user');
    }
    return userOrError.getValue();
  }

  public static async toPersistence(envelope: Envelope): Promise<any> {

    return {
      name: envelope.name.value,
      userId: envelope.userId.value,
    };
  }
}
