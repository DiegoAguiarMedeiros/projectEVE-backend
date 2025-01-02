import { Request, Response } from "express";
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { CreateCreditCardUseCase } from "./CreateCreditCardUseCase";
import { CreateCreditCardDTO } from "./CreateCreditCardDTO";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { TextUtils } from "../../../../../shared/utils/TextUtils";
import { DecodedExpressRequest } from "../../../../users/infra/http/models/decodedRequest";
import { CreateCreditCardErrors } from "./CreateCreditCardErrors";

export class CreateCreditCardController extends BaseController {

  private useCase: CreateCreditCardUseCase;

  constructor(useCase: CreateCreditCardUseCase) {
    super();
    this.useCase = useCase;
  }


  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
    let dto: CreateCreditCardDTO = req.body as CreateCreditCardDTO;
    const { id } = req.decoded;
    dto = {
      id: new UniqueEntityID(),
      name: TextUtils.sanitize(dto.name),
      userId: id,
      active: true,
      flag: dto.flag,
    }

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateCreditCardErrors.NameTakenError:
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