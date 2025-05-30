import bcrypt from 'bcryptjs';
import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { ValueObject } from '../../../../shared/domain/ValueObject';

export interface IPasswordProps {
  value: string;
  hashed?: boolean;
}

export class Password extends ValueObject<IPasswordProps> {
  public static minLength: number = 8;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: IPasswordProps) {
    super(props);
  }

  private static isAppropriateLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  /**
   * @method comparePassword
   * @desc Compares as plain-text and hashed password.
   */

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;
    if (this.isAlreadyHashed()) {
      hashed = this.props.value;
      return this.bcryptCompare(plainTextPassword, hashed);
    } else {
      return this.props.value === plainTextPassword;
    }
  }

  private bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainText, hashed, (err, compareResult) => {
        if (err) return resolve(false);
        return resolve(compareResult);
      });
    });
  }


  public isAlreadyHashed(): boolean {
    return this.props.hashed === true;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await new Promise<string>((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) reject(err);
        resolve(salt);
      });
    }); // Generate salt with cost factor 10
    return new Promise<string>((resolve, reject) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    }); // Hash the password with the generated salt
  }


  public getHashedValue(): Promise<string> {
    return new Promise((resolve) => {
      if (this.isAlreadyHashed()) {
        return resolve(this.props.value);
      } else {
        return resolve(this.hashPassword(this.props.value));
      }
    });
  }

  public static create(props: IPasswordProps): Result<Password> {
    const propsResult = Guard.againstNullOrUndefined(props.value, "password");

    if (propsResult.isFailure) {
      return Result.fail<Password>('Password: ' + propsResult.getErrorValue());
    } else {
      if (!props.hashed) {
        if (!this.isAppropriateLength(props.value)) {
          return Result.fail<Password>(
            "Password doesnt meet criteria [8 chars min]."
          );
        }
      }

      return Result.ok<Password>(
        new Password({
          value: props.value,
          hashed: !!props.hashed === true,
        })
      );
    }
  }
}
