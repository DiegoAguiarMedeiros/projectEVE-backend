import { Request, Response } from "express";
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { GetByIdUseCase } from "./GetByIdUseCase";
import { DecodedExpressRequest } from "../../../../users/infra/http/models/decodedRequest";
import { Envelope } from "../../../domain/envelope";
import { GetByIdDTOResquest } from "./GetByIdDTO";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";

export class GetByIdController extends BaseController {
    private useCase: GetByIdUseCase;

    constructor(useCase: GetByIdUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
        try {
            let params: any = req.params;
            const { id } = req.decoded;
            const requestDTO: GetByIdDTOResquest = {
                envelopeId: new UniqueEntityID(params.id),
                userId: new UniqueEntityID(id),
            }
            const result = await this.useCase.execute(requestDTO);

            if (result.isLeft()) {
                const error = result.value;
                switch (error.constructor) {
                    default:
                        return this.fail(res,
                            error.getErrorValue() === undefined ?
                                String(error.getErrorValue()) :
                                error.getErrorValue().message === undefined ? String(error.getErrorValue()) : error.getErrorValue().message);
                }
            } else {
                const dto: Envelope = result.value.getValue() as unknown as Envelope;
                return this.ok<Envelope>(res, dto);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}