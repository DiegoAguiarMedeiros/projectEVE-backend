import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { UpdateBaseEnvelopeAdminUseCase } from './UpdateBaseEnvelopeAdminUseCase';

export class UpdateBaseEnvelopeAdminController extends BaseController {
  private useCase: UpdateBaseEnvelopeAdminUseCase;

  constructor(useCase: UpdateBaseEnvelopeAdminUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const id = req.params.id as string;
      const { name, color, order } = req.body;

      const result = await this.useCase.execute({ id, name, color, order });

      if (result.isLeft()) {
        return this.fail(res, result.value.getErrorValue().message);
      }

      return this.ok(res);
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
