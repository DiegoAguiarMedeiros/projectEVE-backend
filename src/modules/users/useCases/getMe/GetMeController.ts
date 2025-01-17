
import { GetMeUserUseCase } from "./GetMeUseCase";
import { GetMeDTO, GetMeDTOResponse } from "./GetMeDTO";
import { GetMeUseCaseErrors } from "./GetMeErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import * as express from 'express'
import { DecodedExpressRequest } from "../../infra/http/models/decodedRequest";

export class GetMeController extends BaseController {
  private useCase: GetMeUserUseCase;

  constructor(useCase: GetMeUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: GetMeDTO = req.body as GetMeDTO;
    try {
      const user = req.decoded;

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    
      // Retorna as informações do usuário
      res.json({
        ...user
      });

    } catch (err) {
      return this.fail(res, err as string | Error)
    }
  }
}