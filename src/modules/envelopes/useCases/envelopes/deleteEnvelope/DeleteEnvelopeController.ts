import { Request, Response } from "express";
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { DeleteEnvelopeUseCase } from "./DeleteEnvelopeUseCase";
import { DeleteEnvelopeDTO } from "./DeleteEnvelopeDTO";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { DecodedExpressRequest } from "../../../../users/infra/http/models/decodedRequest";
import { DeleteEnvelopeErrors } from "./DeleteEnvelopeErrors";

export class DeleteEnvelopeController extends BaseController {

    private useCase: DeleteEnvelopeUseCase;

    constructor(useCase: DeleteEnvelopeUseCase) {
        super();
        this.useCase = useCase;
    }


    async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
        let params: any = req.params;
        const { id } = req.decoded;
        const dto: DeleteEnvelopeDTO = {
            id: new UniqueEntityID(params.id),
            userId: new UniqueEntityID(id),
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case DeleteEnvelopeErrors.EnvelopeNotFound:
                        return this.conflict(res, error.getErrorValue())
                    case DeleteEnvelopeErrors.EnvelopeCanNotBeDeleted:
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