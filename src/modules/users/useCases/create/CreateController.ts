
import { CreateUseCase } from "./CreateUseCase";
import { CreateDTO } from "./CreateDTO";
import { CreateErrors } from "./CreateErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { TextUtils } from "../../../../shared/utils/TextUtils";
import { DecodedExpressRequest } from "../../infra/http/models/decodedRequest";
import * as express from 'express'
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";

export class CreateController extends BaseController {
  private useCase: CreateUseCase;

  constructor(useCase: CreateUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    let dto: CreateDTO = req.body as CreateDTO;

    dto = {
      id: new UniqueEntityID(),
      name: TextUtils.sanitize(dto.name),
      email: TextUtils.sanitize(dto.email),
      password: dto.password
    }

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateErrors.NameTakenError:
            return this.conflict(res, error.getErrorValue())
          case CreateErrors.EmailAlreadyExistsError:
            return this.conflict(res, error.getErrorValue())
          default:
            return this.fail(res, error.getErrorValue());
        }

      } else {
        return this.ok(res);
      }

    } catch (err) {
      return this.fail(res, err as string | Error)
    }
  }
}