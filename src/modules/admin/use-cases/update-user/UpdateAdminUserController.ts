import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { UpdateAdminUserUseCase } from './UpdateAdminUserUseCase';

export class UpdateAdminUserController extends BaseController {
  private useCase: UpdateAdminUserUseCase;

  constructor(useCase: UpdateAdminUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const { id } = req.params;
      const { isDeleted, isAdminUser, isEmailVerified } = req.body;

      const result = await this.useCase.execute({
        userId: id,
        isDeleted,
        isAdminUser,
        isEmailVerified,
      });

      if (result.isLeft()) {
        return this.fail(res, result.value.getErrorValue().message);
      }

      return this.ok(res);
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
