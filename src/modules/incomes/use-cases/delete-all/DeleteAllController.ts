import { Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { DeleteAllDTO } from "./DeleteAllDTO";
import { DeleteAllUseCase } from "./DeleteAllUseCase";
import { DeleteAllErrors } from "./DeleteAllErrors";

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
                const error = result.value;

                switch (error.constructor) {
                    case DeleteAllErrors.NothingToDelete:
                        return this.clientError(res, error.getErrorValue().message);
                    default:
                        return this.fail(res, error.getErrorValue());
                }
            } else {
                return this.ok(res);
            }

        } catch (err) {
            return this.fail(res, err as string | Error);
        }
    }
}
