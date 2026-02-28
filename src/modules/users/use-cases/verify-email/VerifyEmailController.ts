import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { DecodedExpressRequest } from '../../../../shared/infrastructure/http/models/DecodedExpressRequest';
import { VerifyEmailUseCase } from './VerifyEmailUseCase';
import { VerifyEmailErrors } from './VerifyEmailErrors';

export class VerifyEmailController extends BaseController {
  private useCase: VerifyEmailUseCase;

  constructor(useCase: VerifyEmailUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const token = req.query.token as string;

    if (!token) {
      return this.clientError(res, 'Token não informado.');
    }

    try {
      const result = await this.useCase.execute({ token });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case VerifyEmailErrors.InvalidOrExpiredTokenError:
            return this.clientError(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      }

      return this.ok(res, { message: 'E-mail verificado com sucesso!' });
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
