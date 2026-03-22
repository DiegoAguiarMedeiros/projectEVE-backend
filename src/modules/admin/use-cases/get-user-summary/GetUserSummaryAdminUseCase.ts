import { UseCase } from '../../../../shared/core/UseCase';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { UserSummaryDTO } from '../../dtos';
import models from '../../../../shared/infrastructure/database/sequelize/models';

interface GetUserSummaryAdminRequest {
  userId: string;
}

type Response = Either<AppError.UnexpectedError, Result<UserSummaryDTO>>;

export class GetUserSummaryAdminUseCase implements UseCase<GetUserSummaryAdminRequest, Promise<Response>> {
  public async execute(request: GetUserSummaryAdminRequest): Promise<Response> {
    try {
      const { userId } = request;

      const [totalEnvelopes, totalIncomes, totalProcessedIncomes, envelopes] = await Promise.all([
        models.Envelopes.count({ where: { user_id: userId } }),
        models.Incomes.count({ where: { user_id: userId } }),
        models.ProcessedIncome.count({ where: { user_id: userId } }),
        models.Envelopes.findAll({ where: { user_id: userId }, attributes: ['id'], raw: true }),
      ]);

      const envelopeIds = envelopes.map((e: any) => e.id);

      let totalTransactions = 0;
      if (envelopeIds.length > 0) {
        totalTransactions = await models.Transactions.count({
          where: { envelope_id: envelopeIds },
        });
      }

      const dto: UserSummaryDTO = {
        totalEnvelopes,
        totalIncomes,
        totalTransactions,
        totalProcessedIncomes,
      };

      return right(Result.ok(dto));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
