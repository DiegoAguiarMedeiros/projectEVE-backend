import { EnvelopeDTO } from "../../../domain/dto/envelope";
import { Envelope } from "../../../domain/entities/envelope/Envelope";
import { Percentage } from "../../../domain/entities/envelope/Percentage";
import { Balance } from "../../../domain/shared/Balance";
import { Color } from "../../../domain/shared/Color";
import { Id } from "../../../domain/shared/Id";
import { Name } from "../../../domain/shared/Name";
import { Mapper } from "../Mapper";


export class EnvelopeMap implements Mapper<Envelope> {
  public static toDTO(envelope: Envelope): EnvelopeDTO {
    return {
      id: envelope.id.value,
      active: envelope.active,
      is_editable: envelope.is_editable,
      balance: envelope.balance.value,
      name: envelope.name.value,
      color: envelope.color.value,
      percentage: envelope.percentage.value,
      userId: envelope.userId.value,
    };
  }

  public static toDomain(raw: any): Envelope {
    const NameOrError = Name.create({ name: raw.name });
    const BalanceOrError = Balance.create({ balance: raw.balance });
    const UserIdOrError = Id.create(raw.user_id);
    const IdOrError = Id.create(raw.id);
    const ColorOrError = Color.create({ color: raw.color });
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
    if (PercentageOrError.isFailure) {
      throw new Error('Invalid use Percentage');
    }
    const envelopeOrError = Envelope.create(
      {
        name: NameOrError.getValue(),
        userId: UserIdOrError.getValue(),
        color: ColorOrError.getValue(),
        percentage: PercentageOrError.getValue(),
        id: IdOrError.getValue(),
        active: raw.active,
        is_editable: raw.is_editable,
        balance: BalanceOrError.getValue(),
      }
    );

    if (envelopeOrError.isFailure) {
      throw new Error('Failed to create envelope');
    }
    return envelopeOrError.getValue();
  }

  public static async toPersistence(envelope: Envelope): Promise<any> {

    return {
      id: envelope.id.value,
      active: envelope.active,
      is_editable: envelope.is_editable,
      balance: envelope.balance.value,
      name: envelope.name.value,
      color: envelope.color.value,
      percentage: envelope.percentage.value,
      user_id: envelope.userId.value,
    };
  }
}
