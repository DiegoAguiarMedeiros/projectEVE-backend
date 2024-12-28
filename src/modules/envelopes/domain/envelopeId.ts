
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";

interface EnvelopeIdProps {
  envelopeId: string;
}

export class EnvelopeId extends ValueObject<EnvelopeIdProps> {
  public static maxLength: number = 36;
  public static minLength: number = 36;

  get value(): string {
    return this.props.envelopeId;
  }

  private constructor(props: EnvelopeIdProps) {
    super(props);
  }

  public static create(props: EnvelopeIdProps): Result<EnvelopeId> {
    const EnvelopeIdResult = Guard.againstNullOrUndefined(props.envelopeId, 'envelopeId');
    if (EnvelopeIdResult.isFailure) {
      return Result.fail<EnvelopeId>('EnvelopeId: ' + EnvelopeIdResult.getErrorValue())
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.envelopeId);
    if (minLengthResult.isFailure) {
      return Result.fail<EnvelopeId>('EnvelopeId: ' + minLengthResult.getErrorValue())
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.envelopeId);
    if (maxLengthResult.isFailure) {
      return Result.fail<EnvelopeId>('EnvelopeId: ' + maxLengthResult.getErrorValue())
    }

    return Result.ok<EnvelopeId>(new EnvelopeId(props));
  }
}