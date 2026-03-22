import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { DeleteBaseEnvelopeAdminUseCase } from './DeleteBaseEnvelopeAdminUseCase';

export class DeleteBaseEnvelopeAdminController extends BaseController {
  private useCase: DeleteBaseEnvelopeAdminUseCase;

  constructor(useCase: DeleteBaseEnvelopeAdminUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const { id } = req.params;
      const result = await this.useCase.execute({ id });

      if (result.isLeft()) {
        return this.fail(res, result.value.getErrorValue().message);
      }

      return this.ok(res);
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
