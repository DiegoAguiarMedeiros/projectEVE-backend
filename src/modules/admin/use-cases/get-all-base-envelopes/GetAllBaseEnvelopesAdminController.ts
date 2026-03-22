import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { GetAllBaseEnvelopesAdminUseCase } from './GetAllBaseEnvelopesAdminUseCase';

export class GetAllBaseEnvelopesAdminController extends BaseController {
  private useCase: GetAllBaseEnvelopesAdminUseCase;

  constructor(useCase: GetAllBaseEnvelopesAdminUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(_req: express.Request, res: express.Response): Promise<any> {
    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        return this.fail(res, result.value.getErrorValue().message);
      }

      return this.ok(res, result.value.getValue());
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
