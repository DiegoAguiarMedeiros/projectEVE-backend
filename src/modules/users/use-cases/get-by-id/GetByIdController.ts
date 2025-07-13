
import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { DecodedExpressRequest } from '../../../../shared/infrastructure/http/models/DecodedExpressRequest';
import { GetByIdDTO } from '../../dtos';

export class GetByIdController extends BaseController {

  constructor() {
    super();
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
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