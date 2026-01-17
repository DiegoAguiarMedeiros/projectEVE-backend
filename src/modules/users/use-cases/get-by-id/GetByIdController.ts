
import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { DecodedExpressRequest } from '../../../../shared/infrastructure/http/models/DecodedExpressRequest';
import { GetByIdDTO } from '../../dtos';
import { Interface as UserRepository } from '../../repos/Interface';
import { UserMap } from '../../mappers';

export class GetByIdController extends BaseController {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    super();
    this.userRepo = userRepo;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    try {
      const { id } = req.decoded;

      const user = await this.userRepo.getUserByUserId(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(UserMap.toDTO(user));

    } catch (err) {
      return this.fail(res, err as string | Error)
    }
  }
}