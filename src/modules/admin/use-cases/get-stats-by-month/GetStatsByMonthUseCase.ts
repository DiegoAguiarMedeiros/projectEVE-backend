import { UseCase } from '../../../../shared/core/UseCase';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { MonthlyStatDTO } from '../../dtos';
import models from '../../../../shared/infrastructure/database/sequelize/models';
import { Op, fn, col, literal } from 'sequelize';

interface GetStatsByMonthRequest {
  type: 'users' | 'transactions';
  months?: number;
}

type Response = Either<AppError.UnexpectedError, Result<MonthlyStatDTO[]>>;

export class GetStatsByMonthUseCase implements UseCase<GetStatsByMonthRequest, Promise<Response>> {
  public async execute(request: GetStatsByMonthRequest): Promise<Response> {
    try {
      const monthsBack = request.months ?? 12;
      const since = new Date();
      since.setMonth(since.getMonth() - monthsBack);
      since.setDate(1);
      since.setHours(0, 0, 0, 0);

      const model = request.type === 'users' ? models.Users : models.Transactions;

      const rows = await model.findAll({
        attributes: [
          [fn('EXTRACT', literal('YEAR FROM created_at')), 'year'],
          [fn('EXTRACT', literal('MONTH FROM created_at')), 'month'],
          [fn('COUNT', col('id')), 'count'],
        ],
        where: { created_at: { [Op.gte]: since } },
        group: [
          fn('EXTRACT', literal('YEAR FROM created_at')),
          fn('EXTRACT', literal('MONTH FROM created_at')),
        ],
        order: [
          [fn('EXTRACT', literal('YEAR FROM created_at')), 'ASC'],
          [fn('EXTRACT', literal('MONTH FROM created_at')), 'ASC'],
        ],
        raw: true,
      });

      const dto: MonthlyStatDTO[] = rows.map((r: any) => ({
        year: parseInt(r.year, 10),
        month: parseInt(r.month, 10),
        count: parseInt(r.count, 10),
      }));

      return right(Result.ok(dto));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
