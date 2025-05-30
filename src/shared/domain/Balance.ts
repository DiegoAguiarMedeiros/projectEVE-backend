import { Guard } from "../core/Guard";
import { Result } from "../core/Result";
import { ValueObject } from "./ValueObject";



interface BalanceProps {
  balance: number;
}

export class Balance extends ValueObject<BalanceProps> {

  get value(): number {
    return this.props.balance;
  }

  private constructor(props: BalanceProps) {
    super(props);
  }

  public static create(props: BalanceProps): Result<Balance> {
    const BalanceResult = Guard.againstNullOrUndefined(props.balance, 'Balance');
    if (BalanceResult.isFailure) {
      return Result.fail<Balance>('Balance: ' + BalanceResult.getErrorValue())
    }


    return Result.ok<Balance>(new Balance(props));
  }
}