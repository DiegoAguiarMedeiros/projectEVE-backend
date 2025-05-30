import { CreditCardDTO } from "../dtos";
import { Id } from "../../../shared/domain/Id";
import { Name } from "../../../shared/domain/Name";
import { Mapper } from "../../../shared/mappers/Mapper";
import { CreditCard } from "../domain";
import { Flag } from "../domain";


export class CreditCardMap implements Mapper<CreditCard> {
  public static toDTO(CreditCard: CreditCard): CreditCardDTO {
    return {
      id: CreditCard.id.value,
      name: CreditCard.name.value,
      flag: CreditCard.flag.value,
      active: CreditCard.active,
      userId: CreditCard.userId.value,
    };
  }

  public static toDomain(raw: any): CreditCard {
    const NameOrError = Name.create({ name: raw.name });
    const FlagOrError = Flag.create({ flag: raw.flag });
    const UserIdOrError = Id.create(raw.user_id);
    const IdOrError = Id.create(raw.id);

    if (NameOrError.isFailure) {
      throw new Error('Invalid use name');
    }
    if (UserIdOrError.isFailure) {
      throw new Error('Invalid use id');
    }

    const CreditCardOrError = CreditCard.create(
      {
        name: NameOrError.getValue(),
        flag: FlagOrError.getValue(),
        userId: UserIdOrError.getValue(),
        id: IdOrError.getValue(),
        active: raw.active,
      }
    );

    if (CreditCardOrError.isFailure) {
      throw new Error('Failed to create CreditCard');
    }
    return CreditCardOrError.getValue();
  }

  public static async toPersistence(CreditCard: CreditCard): Promise<any> {

    return {
      id: CreditCard.id.value,
      name: CreditCard.name.value,
      flag: CreditCard.flag.value,
      active: CreditCard.active,
      user_id: CreditCard.userId.value,
    };
  }
}
