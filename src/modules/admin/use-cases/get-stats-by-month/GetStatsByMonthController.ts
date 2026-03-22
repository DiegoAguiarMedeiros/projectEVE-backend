import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { GetStatsByMonthUseCase } from './GetStatsByMonthUseCase';

export class GetStatsByMonthController extends BaseController {
  private useCase: GetStatsByMonthUseCase;

  constructor(useCase: GetStatsByMonthUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const type = req.params.type as 'users' | 'transactions';
      const months = req.query.months ? parseInt(req.query.months as string, 10) : undefined;

      if (type !== 'users' && type !== 'transactions') {
        return this.clientError(res, 'type must be "users" or "transactions"');
      }

      const result = await this.useCase.execute({ type, months });

      if (result.isLeft()) {
        return this.fail(res, result.value.getErrorValue().message);
      }

      return this.ok(res, result.value.getValue());
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
