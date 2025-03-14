
import { LoginUserUseCase } from "./LoginUseCase";
import { LoginDTO, LoginDTOResponse } from "./LoginDTO";
import { LoginUseCaseErrors } from "./LoginErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import * as express from 'express'
import { DecodedExpressRequest } from "../../infra/http/models/decodedRequest";

export class LoginController extends BaseController {
  private useCase: LoginUserUseCase;

  constructor(useCase: LoginUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: LoginDTO = req.body as LoginDTO;
    
    try {
      const result = await this.useCase.execute(dto);
      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case LoginUseCaseErrors.EmailDoesntExistError:
            return this.notFound(res, error.getErrorValue().message)
          default:
            return this.fail(res,
              error.getErrorValue() === undefined ?
                String(error.getErrorValue()) :
                error.getErrorValue().message === undefined ? String(error.getErrorValue()) : error.getErrorValue().message);
        }
      } else {
        const dto: LoginDTOResponse = result.value.getValue() as LoginDTOResponse;

        res.cookie('accessToken', dto.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Requer HTTPS em produção
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000, 
        });
    
        res.cookie('refreshToken', dto.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return this.ok(res);
      }

    } catch (err) {
      return this.fail(res, err as string | Error)
    }
  }
}