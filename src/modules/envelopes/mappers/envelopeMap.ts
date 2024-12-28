import { Mapper } from "../../../shared/infra/Mapper";
import { Envelope } from "../domain/envelope";
import { EnvelopeDTO } from "../dtos/envelopeDTO";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Name } from "../domain/name";
import { UserId } from "../domain/userId";
import { Id } from "../../../shared/domain/Id";
import { Balance } from "../domain/balance";

export class EnvelopeMap implements Mapper<Envelope> {
  public static toDTO(envelope: Envelope): EnvelopeDTO {
    return {
      id: envelope.id.value,
      disable: envelope.disable,
      balance: envelope.balance.value,
      name: envelope.name.value,
      userId: envelope.userId.value,
    };
  }

  public static toDomain(raw: any): Envelope {
    const NameOrError = Name.create({ name: raw.name });
    const BalanceOrError = Balance.create({ balance: raw.balance });
    const UserIdOrError = Id.create(raw.user_id);
    const IdOrError = Id.create(raw.id);

    if (NameOrError.isFailure) {
      throw new Error('Invalid use name');
    }
    if (UserIdOrError.isFailure) {
      throw new Error('Invalid use id');
    }

    const envelopeOrError = Envelope.create(
      {
        name: NameOrError.getValue(),
        userId: UserIdOrError.getErrorValue(),
        id: IdOrError.getErrorValue(),
        disable: raw.disable,
        balance: BalanceOrError.getErrorValue(),
      }
    );

    if (envelopeOrError.isFailure) {
      throw new Error('Failed to create user');
    }
    return envelopeOrError.getValue();
  }

  public static async toPersistence(envelope: Envelope): Promise<any> {

    return {
      id: envelope.id.value,
      disable: envelope.disable,
      balance: envelope.balance.value,
      name: envelope.name.value,
      user_id: envelope.userId.value,
    };
  }
}
