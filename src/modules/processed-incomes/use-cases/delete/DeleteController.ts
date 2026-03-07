import { Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { DeleteDTO } from "../../dtos";
import { DeleteUseCase } from "./DeleteUseCase";
import { DeleteErrors } from "./DeleteErrors";

export class DeleteController extends BaseController {

  private useCase: DeleteUseCase;

  constructor(useCase: DeleteUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
    const { id } = req.decoded;
    const dto: DeleteDTO = {
      id: req.params.id as string,
      userId: id,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeleteErrors.NotFound:
            return this.notFound(res, error.getErrorValue().toString());
          default:
            return this.fail(res, error.getErrorValue().toString());
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
