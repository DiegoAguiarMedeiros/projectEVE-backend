import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { GetAllAdminUsersUseCase } from './GetAllAdminUsersUseCase';

export class GetAllAdminUsersController extends BaseController {
  private useCase: GetAllAdminUsersUseCase;

  constructor(useCase: GetAllAdminUsersUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const { page, limit, search, isDeleted, isAdmin } = req.query;

      const result = await this.useCase.execute({
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
        search: search as string | undefined,
        isDeleted: isDeleted !== undefined ? isDeleted === 'true' : undefined,
        isAdmin: isAdmin !== undefined ? isAdmin === 'true' : undefined,
      });

      if (result.isLeft()) {
        return this.fail(res, result.value.getErrorValue().message);
      }

      return this.ok(res, result.value.getValue());
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
