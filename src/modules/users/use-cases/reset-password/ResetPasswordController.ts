import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { DecodedExpressRequest } from '../../../../shared/infrastructure/http/models/DecodedExpressRequest';
import { ResetPasswordUseCase } from './ResetPasswordUseCase';
import { ResetPasswordErrors } from './ResetPasswordErrors';
import { ResetPasswordDTO } from './ResetPasswordDTO';

export class ResetPasswordController extends BaseController {
  private useCase: ResetPasswordUseCase;

  constructor(useCase: ResetPasswordUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: ResetPasswordDTO = {
      token: req.body.token,
      newPassword: req.body.newPassword,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ResetPasswordErrors.InvalidOrExpiredTokenError:
            return this.clientError(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue());
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
