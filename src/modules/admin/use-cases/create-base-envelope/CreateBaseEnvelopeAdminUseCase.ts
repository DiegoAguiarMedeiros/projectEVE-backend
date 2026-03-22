import { UseCase } from '../../../../shared/core/UseCase';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { Guard } from '../../../../shared/core/Guard';
import { Interface as IBaseEnvelopeRepo } from '../../../base-envelope/repos/Interface';
import { BaseEnvelope } from '../../../base-envelope/domain/BaseEnvelope';
import { Name } from '../../../../shared/domain/Name';
import { Color } from '../../../../shared/domain/Color';
import { Balance } from '../../../../shared/domain/Balance';
import { CreateBaseEnvelopeDTO } from '../../dtos';

type Response = Either<AppError.UnexpectedError, Result<void>>;

export class CreateBaseEnvelopeAdminUseCase implements UseCase<CreateBaseEnvelopeDTO, Promise<Response>> {
  private baseEnvelopeRepo: IBaseEnvelopeRepo;

  constructor(baseEnvelopeRepo: IBaseEnvelopeRepo) {
    this.baseEnvelopeRepo = baseEnvelopeRepo;
  }

  public async execute(request: CreateBaseEnvelopeDTO): Promise<Response> {
    try {
      const guardResult = Guard.againstNullOrUndefinedBulk([
        { argument: request.name, argumentName: 'name' },
        { argument: request.color, argumentName: 'color' },
        { argument: request.order, argumentName: 'order' },
      ]);

      if (guardResult.isFailure) {
        return left(new AppError.UnexpectedError(guardResult.getErrorValue()));
      }

      const nameOrError = Name.create({ name: request.name });
      const colorOrError = Color.create({ color: request.color });
      const orderOrError = Balance.create({ balance: request.order });

      const combined = Result.combine([nameOrError, colorOrError, orderOrError]);
      if (combined.isFailure) {
        return left(new AppError.UnexpectedError(combined.getErrorValue()));
      }

      const baseEnvelopeOrError = BaseEnvelope.create({
        name: nameOrError.getValue(),
        color: colorOrError.getValue(),
        order: orderOrError.getValue(),
      });

      if (baseEnvelopeOrError.isFailure) {
        return left(new AppError.UnexpectedError(baseEnvelopeOrError.getErrorValue()));
      }

      await this.baseEnvelopeRepo.save(baseEnvelopeOrError.getValue());
      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
