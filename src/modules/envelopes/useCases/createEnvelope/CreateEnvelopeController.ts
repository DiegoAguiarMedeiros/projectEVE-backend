
import { CreateEnvelopeUseCase } from "./CreateEnvelopeUseCase";
import { CreateEnvelopeDTO } from "./CreateEnvelopeDTO";
import { CreateEnvelopeErrors } from "./CreateEnvelopeErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { TextUtils } from "../../../../shared/utils/TextUtils";
import { DecodedExpressRequest } from "../../infra/http/models/decodedRequest";
import * as express from 'express'

export class CreateEnvelopeController extends BaseController {
  private useCase: CreateEnvelopeUseCase;

  constructor(useCase: CreateEnvelopeUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    let dto: CreateEnvelopeDTO = req.body as CreateEnvelopeDTO;

    dto = {
      name: TextUtils.sanitize(dto.name),
      userId: dto.userId
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