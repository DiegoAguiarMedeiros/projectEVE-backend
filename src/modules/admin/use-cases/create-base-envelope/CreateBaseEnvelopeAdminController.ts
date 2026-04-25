import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { CreateBaseEnvelopeAdminUseCase } from './CreateBaseEnvelopeAdminUseCase';

export class CreateBaseEnvelopeAdminController extends BaseController {
  private useCase: CreateBaseEnvelopeAdminUseCase;

  constructor(useCase: CreateBaseEnvelopeAdminUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const { name, color, order, percentage } = req.body;
      const result = await this.useCase.execute({ name, color, order, percentage });

      if (result.isLeft()) {
        return this.fail(res, result.value.getErrorValue().message);
      }

      return this.created(res);
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
