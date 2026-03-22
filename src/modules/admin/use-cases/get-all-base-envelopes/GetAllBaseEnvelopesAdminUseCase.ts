import { UseCase } from '../../../../shared/core/UseCase';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { Interface as IBaseEnvelopeRepo } from '../../../base-envelope/repos/Interface';
import { AdminBaseEnvelopeDTO } from '../../dtos';

type Response = Either<AppError.UnexpectedError, Result<AdminBaseEnvelopeDTO[]>>;

export class GetAllBaseEnvelopesAdminUseCase implements UseCase<void, Promise<Response>> {
  private baseEnvelopeRepo: IBaseEnvelopeRepo;

  constructor(baseEnvelopeRepo: IBaseEnvelopeRepo) {
    this.baseEnvelopeRepo = baseEnvelopeRepo;
  }

  public async execute(): Promise<Response> {
    try {
      const envelopes = await this.baseEnvelopeRepo.getAll();
      const dtos: AdminBaseEnvelopeDTO[] = envelopes.map((e) => ({
        id: e.id.toString(),
        name: e.name.value,
        color: e.color.value,
        order: e.order.value,
      }));
      return right(Result.ok(dtos));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
