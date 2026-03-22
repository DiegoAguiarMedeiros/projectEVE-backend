import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { GetUserSummaryAdminUseCase } from './GetUserSummaryAdminUseCase';

export class GetUserSummaryAdminController extends BaseController {
  private useCase: GetUserSummaryAdminUseCase;

  constructor(useCase: GetUserSummaryAdminUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const userId = req.params.userId as string;
      const result = await this.useCase.execute({ userId });

      if (result.isLeft()) {
        return this.fail(res, result.value.getErrorValue().message);
      }

      return this.ok(res, result.value.getValue());
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
