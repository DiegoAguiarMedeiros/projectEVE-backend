import { Request, Response } from "express";
import { CreateUseCase } from "../../../../../application/useCases/transaction/create/CreateUseCase";
import { CreateDTO } from "../../../../../application/useCases/transaction/create/CreateDTO";
import { TextUtils } from "../../../../../shared/utils/TextUtils";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";

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
      creditCardId: dto.creditCardId,
      envelopeId: dto.envelopeId,
      description: TextUtils.sanitize(dto.description),
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      date: dto.date,
      type: dto.type,
      status: dto.status,
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