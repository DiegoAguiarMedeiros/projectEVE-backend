import { Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { ProcessAllDTO } from "../../dtos";
import { ProcessAllUseCase } from "./ProcessAllUseCase";
import { ProcessAllErrors } from "./ProcessAllErrors";

export class ProcessAllController extends BaseController {

  private useCase: ProcessAllUseCase;

  constructor(useCase: ProcessAllUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
    const { id } = req.decoded;
    const dto: ProcessAllDTO = {
      userId: id,
      month: Number(req.body.month),
      year: Number(req.body.year),
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ProcessAllErrors.NoIncomesFound:
            return this.notFound(res, error.getErrorValue());
          default:
            return this.fail(res, error.getErrorValue());
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      return this.fail(res, err as string | Error);
    }
  }
}
