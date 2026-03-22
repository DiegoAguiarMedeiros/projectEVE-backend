import { UseCase } from '../../../../shared/core/UseCase';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import models from '../../../../shared/infrastructure/database/sequelize/models';

interface GetUserEnvelopesAdminRequest {
  userId: string;
}

interface UserEnvelopeDTO {
  id: string;
  name: string;
  color: string;
  order: number;
  percentage: number;
}

type Response = Either<AppError.UnexpectedError, Result<UserEnvelopeDTO[]>>;

export class GetUserEnvelopesAdminUseCase implements UseCase<GetUserEnvelopesAdminRequest, Promise<Response>> {
  public async execute(request: GetUserEnvelopesAdminRequest): Promise<Response> {
    try {
      const envelopes = await models.Envelopes.findAll({
        where: { user_id: request.userId },
        order: [['order', 'ASC']],
        raw: true,
      });

      const dtos: UserEnvelopeDTO[] = envelopes.map((e: any) => ({
        id: e.id,
        name: e.name,
        color: e.color,
        order: e.order,
        percentage: e.percentage,
      }));

      return right(Result.ok(dtos));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
