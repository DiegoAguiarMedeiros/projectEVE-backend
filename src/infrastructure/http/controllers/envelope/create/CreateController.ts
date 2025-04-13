import { Request, Response } from "express";
import { UniqueEntityID } from "../../../../../domain/shared/UniqueEntityID";
import { TextUtils } from "../../../../../shared/utils/TextUtils";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { CreateUseCase } from "../../../../../application/useCases/envelope/create/CreateUseCase";
import { CreateDTO } from "../../../../../application/useCases/envelope/create/CreateDTO";
import { CreateErrors } from "../../../../../application/useCases/envelope/create/CreateErrors";

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
      id: new UniqueEntityID(),
      name: TextUtils.sanitize(dto.name),
      userId: id,
      active: true,
      is_editable: true,
      balance: 0
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