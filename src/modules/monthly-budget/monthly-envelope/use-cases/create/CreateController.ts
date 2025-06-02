import { Request, Response } from "express";
import { BaseController } from "../../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { CreateMonthlyWithTansactionDTO } from "../../dtos";
import { CreateErrors } from "./CreateErrors";
import { CreateUseCase } from "./CreateUseCase";

export class CreateController extends BaseController {

  private useCase: CreateUseCase;

  constructor(useCase: CreateUseCase) {
    super();
    this.useCase = useCase;
  }


  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
    const dto: CreateMonthlyWithTansactionDTO = {
      createMonthlyEnvelope: req.body.createMonthlyEnvelope,
      percentage: req.body.percentage,
      balance: req.body.balance,
      reference: req.body.reference,
      envelopeId: req.body.envelope,
      description: req.body.description,
      amount: req.body.amount,
      date: req.body.date,
      debtId: req.body.debtId,
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