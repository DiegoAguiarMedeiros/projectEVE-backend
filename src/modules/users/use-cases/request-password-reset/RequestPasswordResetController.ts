import * as express from 'express';
import { TextUtils } from '../../../../shared/utils/TextUtils';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { DecodedExpressRequest } from '../../../../shared/infrastructure/http/models/DecodedExpressRequest';
import { RequestPasswordResetUseCase } from './RequestPasswordResetUseCase';
import { RequestPasswordResetDTO } from './RequestPasswordResetDTO';

export class RequestPasswordResetController extends BaseController {
  private useCase: RequestPasswordResetUseCase;

  constructor(useCase: RequestPasswordResetUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: RequestPasswordResetDTO = {
      email: TextUtils.sanitize(req.body.email),
      locale: req.body.locale,
    };

    try {
      await this.useCase.execute(dto);
      // Always return 200 — anti-enumeration
      return this.ok(res);
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
