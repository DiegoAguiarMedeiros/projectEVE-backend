import {  Response } from "express";
import { CreateUseCase } from "../../../../../application/useCases/creditCard/create/CreateUseCase";
import { TextUtils } from "../../../../../shared/utils/TextUtils";
import { CreateErrors } from "../../../../../application/useCases/creditCard/create/CreateErrors";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { CreateDTO} from "../../../../../domain/dto/creditCard";

export class CreateController extends BaseController {

  private useCase: CreateUseCase;

  constructor(useCase: CreateUseCase) {
    super();
    this.useCase = useCase;
  }


  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
    let dto = req.body as CreateDTO;
    const { id } = req.decoded;
    dto = {
      name: TextUtils.sanitize(dto.name),
      userId: id,
      active: true,
      flag: dto.flag,
    }

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateErrors.NameTakenError:
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