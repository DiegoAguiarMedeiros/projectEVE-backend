import { Request, Response } from "express";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { CreateEnvelopeUseCase } from "./CreateEnvelopeUseCase";
import { CreateEnvelopeDTO } from "./CreateEnvelopeDTO";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { TextUtils } from "../../../../shared/utils/TextUtils";
import { DecodedExpressRequest } from "../../../users/infra/http/models/decodedRequest";
import { CreateEnvelopeErrors } from "./CreateEnvelopeErrors";

export class CreateEnvelopeController extends BaseController {

  private useCase: CreateEnvelopeUseCase;

  constructor(useCase: CreateEnvelopeUseCase) {
    super();
    this.useCase = useCase;
  }


  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
    let dto: CreateEnvelopeDTO = req.body as CreateEnvelopeDTO;
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
          case CreateEnvelopeErrors.NameTakenError:
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