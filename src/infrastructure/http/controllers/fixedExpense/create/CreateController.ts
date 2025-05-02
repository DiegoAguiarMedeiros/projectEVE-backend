import { Request, Response } from "express";
import { TextUtils } from "../../../../../shared/utils/TextUtils";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { CreateUseCase } from "../../../../../application/useCases/fixedExpense/create/CreateUseCase";
import { CreateErrors } from "../../../../../application/useCases/fixedExpense/create/CreateErrors";
import { CreateDTO } from "../../../../../domain/dto/fixedExpense";

export class CreateController extends BaseController {

  private useCase: CreateUseCase;

  constructor(useCase: CreateUseCase) {
    super();
    this.useCase = useCase;
  }


  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
    //const { id } = req.decoded;
    const dto: CreateDTO = {
      description: TextUtils.sanitize(req.body.description),
      envelopeId: req.body.envelopeId,
      amount: req.body.amount,
      paymentDay: req.body.paymentDay,
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