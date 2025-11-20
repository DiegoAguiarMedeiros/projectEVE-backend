
import { LoginUserUseCase } from "./LoginUseCase";
import { LoginUseCaseErrors } from "./LoginErrors";
import * as express from 'express'
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { LoginDTO, LoginResponseDTO } from "../../dtos";

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
        const dto: LoginResponseDTO = result.value.getValue() as LoginResponseDTO;

        res.cookie('accessToken', dto.accessToken, {
          httpOnly: true,
          secure: true,          
          sameSite: 'none',       
          path: '/',
        });

        res.cookie('refreshToken', dto.refreshToken, {
          httpOnly: true,
          secure: true,          
          sameSite: 'none',       
          path: '/',
        });

        return this.ok(res);
      }

    } catch (err) {
      return this.fail(res, err as string | Error)
    }
  }
}