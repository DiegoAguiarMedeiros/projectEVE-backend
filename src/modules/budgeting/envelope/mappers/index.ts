import { EnvelopeDTO } from "../dtos";
import { Percentage } from "../../../../shared/domain/Percentage";
import { Color } from "../../../../shared/domain/Color";
import { Id } from "../../../../shared/domain/Id";
import { Name } from "../../../../shared/domain/Name";
import { Mapper } from "../../../../shared/mappers/Mapper";
import { Envelope } from "../domain/Envelope";


export class EnvelopeMap implements Mapper<Envelope> {
  public static toDTO(envelope: Envelope): EnvelopeDTO {
    return {
      id: envelope.id.value,
      name: envelope.name.value,
      color: envelope.color.value,
      userId: envelope.userId.value,
      percentage: envelope.percentage.value,
    };
  }

  public static toDomain(raw: any): Envelope {
    const NameOrError = Name.create({ name: raw.name });
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
      name: envelope.name.value,
      color: envelope.color.value,
      percentage: envelope.percentage.value,
      user_id: envelope.userId.value,
    };
  }
}
