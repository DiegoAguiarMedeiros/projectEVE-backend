import { UseCase } from '../../../../shared/core/UseCase';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { Interface as IBaseEnvelopeRepo } from '../../../base-envelope/repos/Interface';

interface DeleteBaseEnvelopeAdminRequest {
  id: string;
}

type Response = Either<AppError.UnexpectedError, Result<void>>;

export class DeleteBaseEnvelopeAdminUseCase implements UseCase<DeleteBaseEnvelopeAdminRequest, Promise<Response>> {
  private baseEnvelopeRepo: IBaseEnvelopeRepo;

  constructor(baseEnvelopeRepo: IBaseEnvelopeRepo) {
    this.baseEnvelopeRepo = baseEnvelopeRepo;
  }

  public async execute(request: DeleteBaseEnvelopeAdminRequest): Promise<Response> {
    try {
      await this.baseEnvelopeRepo.delete(request.id);
      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
