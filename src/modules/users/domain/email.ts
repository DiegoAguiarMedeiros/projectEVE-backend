
import { Result } from '../../../shared/core/Result'
import { ValueObject } from '../../../shared/domain/ValueObject'

export interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: EmailProps) {
    super(props);
  }

  private static isValidEmail(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }

  public static create(email: string): Result<Email> {
    if (email == undefined || email == null) {
      return Result.fail<Email>('User email cannot be null');
    }
    if (!this.isValidEmail(email)) {
      return Result.fail<Email>('Email address not valid');
    }
    return Result.ok<Email>(
      new Email({ value: this.format(email) })
    );

  }
}