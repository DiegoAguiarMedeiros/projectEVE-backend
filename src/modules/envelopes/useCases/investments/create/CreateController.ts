import { Request, Response } from "express";
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { CreateUseCase } from "./CreateUseCase";
import { CreateDTO } from "./CreateDTO";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { TextUtils } from "../../../../../shared/utils/TextUtils";
import { DecodedExpressRequest } from "../../../../users/infra/http/models/decodedRequest";
import { CreateErrors } from "./CreateErrors";

export class CreateController extends BaseController {

  private useCase: CreateUseCase;

  constructor(useCase: CreateUseCase) {
    super();
    this.useCase = useCase;
  }


  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
    let dto: CreateDTO = req.body as CreateDTO;
    const { id } = req.decoded;
    dto = {
      userId: id,
      description: TextUtils.sanitize(dto.description),
      amount: dto.amount,
      type: dto.type,
      applicationDate: dto.applicationDate,
      maturityDate: dto.maturityDate,
      status: dto.status,
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