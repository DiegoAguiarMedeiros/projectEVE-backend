import { Request, Response } from "express";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { TextUtils } from "../../../../shared/utils/TextUtils";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { CreateDTO } from "../../dtos";
import { CreateUseCase } from "./CreateUseCase";
import { CreateErrors } from "./CreateErrors";

export class CreateController extends BaseController {

  private useCase: CreateUseCase;

  constructor(useCase: CreateUseCase) {
    super();
    this.useCase = useCase;
  }


  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
    const { id } = req.decoded;
    const dto: CreateDTO = {
      name: TextUtils.sanitize(req.body.name),
      userId: id,
      color: req.body.color || "#1877F2",
      order: req.body.order ?? 99,
      percentage: req.body.percentage ?? 0,
    }

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateErrors.NameTakenError:
          case CreateErrors.ExceedsTotalPercentageError:
            return this.conflict(res, error.getErrorValue().message)
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