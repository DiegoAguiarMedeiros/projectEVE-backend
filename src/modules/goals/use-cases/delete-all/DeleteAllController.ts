import { Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { DeleteAllUseCase, DeleteAllDTO } from "./DeleteAllUseCase";

export class DeleteAllController extends BaseController {
    private useCase: DeleteAllUseCase;

    constructor(useCase: DeleteAllUseCase) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
        const { id: userId } = req.decoded;
        const dto: DeleteAllDTO = {
            ids: req.body.ids,
            userId,
        };

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                return this.fail(res, result.value.getErrorValue());
            }

            return this.ok(res);
        } catch (err) {
            return this.fail(res, err as string | Error);
        }
    }
}
