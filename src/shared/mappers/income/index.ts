import { IncomeDTO } from "../../../domain/dto/income";
import { Income } from "../../../domain/entities/income/Income";
import { Balance } from "../../../domain/shared/Balance";
import { Description } from "../../../domain/shared/Description";
import { Id } from "../../../domain/shared/Id";
import { PaymentDay } from "../../../domain/shared/PaymentDay";
import { Mapper } from "../Mapper";


export class IncomeMap implements Mapper<Income> {
  public static toDTO(income: Income): IncomeDTO {
    return {
      id: income.id.value,
      userId: income.userId.value,
      description: income.description.value,
      amount: income.amount.value,
      paymentDay: income.paymentDay.value,
    };
  }

  public static toDomain(raw: any): Income {
    
    const DescriptionOrError = Description.create({ description: raw.description });
    DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

    const AmountOrError = Balance.create({ balance: raw.amount });
    AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

    const UserIdOrError = Id.create(raw.user_id);
    UserIdOrError.isFailure ? console.error(UserIdOrError.getErrorValue()) : '';

    const IdOrError = Id.create(raw.id);
    IdOrError.isFailure ? console.error(IdOrError.getErrorValue()) : '';
    
    const PaymentDayOrError = PaymentDay.create({ paymentDay: raw.payment_day });
    PaymentDayOrError.isFailure ? console.error(PaymentDayOrError.getErrorValue()) : '';

    const debtOrError = Income.create(
      {
        id: IdOrError.getValue(),
        userId: UserIdOrError.getValue(),
        description: DescriptionOrError.getValue(),
        amount: AmountOrError.getValue(),
        paymentDay: PaymentDayOrError.getValue(),
      }
    );

    debtOrError.isFailure ? console.error(debtOrError.getErrorValue()) : '';

    return debtOrError.getValue();
  }

  public static async toPersistence(income: Income): Promise<any> {

    return {
      id: income.id.value,
      user_id: income.userId.value,
      description: income.description.value,
      amount: income.amount.value,
      payment_day: income.paymentDay,
    };
  }
}
