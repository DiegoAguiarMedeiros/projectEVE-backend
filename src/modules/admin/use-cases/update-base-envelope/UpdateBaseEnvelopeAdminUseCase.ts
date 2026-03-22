import { UseCase } from '../../../../shared/core/UseCase';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { Interface as IBaseEnvelopeRepo } from '../../../base-envelope/repos/Interface';
import { UpdateBaseEnvelopeDTO } from '../../dtos';

type Response = Either<AppError.UnexpectedError, Result<void>>;

export class UpdateBaseEnvelopeAdminUseCase implements UseCase<UpdateBaseEnvelopeDTO, Promise<Response>> {
  private baseEnvelopeRepo: IBaseEnvelopeRepo;

  constructor(baseEnvelopeRepo: IBaseEnvelopeRepo) {
    this.baseEnvelopeRepo = baseEnvelopeRepo;
  }

  public async execute(request: UpdateBaseEnvelopeDTO): Promise<Response> {
    try {
      const existing = await this.baseEnvelopeRepo.getById(request.id);
      if (!existing) {
        return left(new AppError.UnexpectedError('BaseEnvelope not found'));
      }

      await this.baseEnvelopeRepo.update(request.id, {
        name: request.name,
        color: request.color,
        order: request.order,
      });

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
