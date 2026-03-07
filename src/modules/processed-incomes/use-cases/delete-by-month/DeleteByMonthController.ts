import { Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { DeleteByMonthUseCase, DeleteByMonthDTO } from "./DeleteByMonthUseCase";

export class DeleteByMonthController extends BaseController {
    private useCase: DeleteByMonthUseCase;

    constructor(useCase: DeleteByMonthUseCase) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
        const { id: userId } = req.decoded;
        const dto: DeleteByMonthDTO = {
            year: Number(req.params.year),
            month: Number(req.params.month),
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
