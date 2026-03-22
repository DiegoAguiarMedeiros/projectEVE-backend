import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { GetAdminUserByIdUseCase } from './GetAdminUserByIdUseCase';

export class GetAdminUserByIdController extends BaseController {
  private useCase: GetAdminUserByIdUseCase;

  constructor(useCase: GetAdminUserByIdUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const id = req.params.id as string;
      const result = await this.useCase.execute({ userId: id });

      if (result.isLeft()) {
        return this.fail(res, result.value.getErrorValue().message);
      }

      return this.ok(res, result.value.getValue());
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
