import { UseCase } from '../../../../shared/core/UseCase';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { AdminStatsDTO } from '../../dtos';
import models from '../../../../shared/infrastructure/database/sequelize/models';
import { Op } from 'sequelize';

type Response = Either<AppError.UnexpectedError, Result<AdminStatsDTO>>;

export class GetAdminStatsUseCase implements UseCase<void, Promise<Response>> {
  public async execute(): Promise<Response> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [
        totalUsers,
        activeUsers,
        adminUsers,
        deletedUsers,
        usersRegisteredThisMonth,
        totalEnvelopes,
        totalTransactions,
        totalProcessedIncomes,
      ] = await Promise.all([
        models.Users.count(),
        models.Users.count({ where: { is_deleted: false } }),
        models.Users.count({ where: { is_admin_user: true } }),
        models.Users.count({ where: { is_deleted: true } }),
        models.Users.count({ where: { created_at: { [Op.gte]: startOfMonth } } }),
        models.Envelopes.count(),
        models.Transactions.count(),
        models.ProcessedIncome.count(),
      ]);

      const dto: AdminStatsDTO = {
        totalUsers,
        activeUsers,
        adminUsers,
        deletedUsers,
        usersRegisteredThisMonth,
        totalEnvelopes,
        totalTransactions,
        totalProcessedIncomes,
      };

      return right(Result.ok(dto));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
