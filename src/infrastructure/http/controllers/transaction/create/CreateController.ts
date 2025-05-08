import { Request, Response } from "express";
import { CreateUseCase } from "../../../../../application/useCases/transaction/create/CreateUseCase";
import { TextUtils } from "../../../../../shared/utils/TextUtils";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { CreateDTO } from "../../../../../domain/dto/transaction";

export class CreateController extends BaseController {

  private useCase: CreateUseCase;

  constructor(useCase: CreateUseCase) {
    super();
    this.useCase = useCase;
  }


  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
    const { id } = req.decoded;
    const dto : CreateDTO  = {
      creditCardId: req.body.creditCardId,
      envelope: {
        id: req.body.envelope.id,
        userId: id,
      },
      description: TextUtils.sanitize(req.body.description),
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
      date: req.body.date,
      type: req.body.type,
      status: req.body.status,
    }
    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
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