
import { Percentage } from "../../../shared/domain/Percentage";
import { Goals } from "../domain/Goals";
import { Balance } from "../../../shared/domain/Balance";
import { Color } from "../../../shared/domain/Color";
import { Result } from "../../../shared/core/Result";
import { Description } from "../../../shared/domain/Description";
import { Id } from "../../../shared/domain/Id";
import { Name } from "../../../shared/domain/Name";
import { PaymentDay } from "../../../shared/domain/PaymentDay";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Mapper } from "../../../shared/mappers/Mapper";
import { GoalsDTO } from "../dtos";


export class GoalsMap implements Mapper<Goals> {
  public static toDTO(goals: Goals): GoalsDTO {
    return {
      id: goals.id.toString(),
      envelopeId: goals.envelopeId.value,
      description: goals.description.value,
      amount: goals.amount.value,
      amountTotal: goals.amountTotal.value,
      percentage: goals.percentage.value,
      deadline: goals.deadline,
    };
  }

  public static toDomain(raw: any): Goals {
    const DescriptionOrError = Description.create({ description: raw.description });
    DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';
    
    const PercentageOrError = Percentage.create({ percentage: raw.percentage });
    PercentageOrError.isFailure ? console.error(PercentageOrError.getErrorValue()) : '';

    const AmountOrError = Balance.create({ balance: raw.amount });
    AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

    const AmountTotalOrError = Balance.create({ balance: raw.amount_total });
    AmountTotalOrError.isFailure ? console.error(AmountTotalOrError.getErrorValue()) : '';

    const envelopeIdOrError = Id.create(new UniqueEntityID(raw.envelope_id));

    const envelopeId: Id = envelopeIdOrError.getValue();

    const goalsOrError = Goals.create(
      {
        envelopeId: envelopeId,
        description: DescriptionOrError.getValue(),
        amount: AmountOrError.getValue(),
        amountTotal: AmountTotalOrError.getValue(),
        deadline: raw.deadline,
        percentage: PercentageOrError.getValue(),
      }, new UniqueEntityID(raw.id));

    goalsOrError.isFailure ? console.error(goalsOrError.getErrorValue()) : '';

    return goalsOrError.getValue();
  }

  public static async toPersistence(goals: Goals): Promise<any> {

    return {
      id: goals.id.toString(),
      envelope_id: goals.envelopeId.value,
      description: goals.description.value,
      amount: goals.amount.value,
      amount_total: goals.amountTotal.value,
      percentage: goals.percentage.value,
      deadline: goals.deadline,
    };
  }
}
