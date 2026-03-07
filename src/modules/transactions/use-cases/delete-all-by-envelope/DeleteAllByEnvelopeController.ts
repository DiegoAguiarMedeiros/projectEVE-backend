import { Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { DeleteAllByEnvelopeUseCase } from "./DeleteAllByEnvelopeUseCase";

export class DeleteAllByEnvelopeController extends BaseController {
    private useCase: DeleteAllByEnvelopeUseCase;

    constructor(useCase: DeleteAllByEnvelopeUseCase) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
        const { id: userId } = req.decoded;
        const { id: envelopeId, year, month } = req.params;

        try {
            const result = await this.useCase.execute({
                envelopeId,
                userId,
                year: Number(year),
                month: Number(month),
            });

            if (result.isLeft()) {
                return this.fail(res, result.value.getErrorValue() as string | Error);
            }

            return this.ok(res);
        } catch (err) {
            return this.fail(res, err as string | Error);
        }
    }
}
