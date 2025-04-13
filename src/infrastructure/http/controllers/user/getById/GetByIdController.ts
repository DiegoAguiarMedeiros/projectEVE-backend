
import * as express from 'express';
import { BaseController } from '../../shared/BaseController';
import { DecodedExpressRequest } from '../../shared/DecodedExpressRequest';
import { GetByIdUseCase } from '../../../../../application/useCases/user/getById/GetByIdUseCase';
import { GetByIdDTO } from '../../../../../application/useCases/user/getById/GetByIdDTO';

export class GetByIdController extends BaseController {
  private useCase: GetByIdUseCase;

  constructor(useCase: GetByIdUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: GetByIdDTO = req.body as GetByIdDTO;
    try {
      const user = req.decoded;

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    
      res.json({
        ...user
      });

    } catch (err) {
      return this.fail(res, err as string | Error)
    }
  }
}