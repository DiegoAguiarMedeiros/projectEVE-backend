import { Request, Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { TextUtils } from "../../../../shared/utils/TextUtils";
import { CreateDTO } from "../../dtos";
import { CreateUseCase } from "./CreateUseCase";

export class CreateController extends BaseController {

  private useCase: CreateUseCase;

  constructor(useCase: CreateUseCase) {
    super();
    this.useCase = useCase;
  }


  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
    const { id } = req.decoded;
    const dto: CreateDTO = {
      description: TextUtils.sanitize(req.body.description),
      userId: id,
      ...req.body,
    }
    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error.getErrorValue().message);
        }

      } else {
        return this.ok(res);
      }

    } catch (err) {
      return this.fail(res, err as string | Error)
    }

  }

}