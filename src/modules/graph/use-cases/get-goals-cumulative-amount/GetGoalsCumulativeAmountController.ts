import { Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { GetGoalsCumulativeAmountUseCase } from "./GetGoalsCumulativeAmountUseCase";

export class GetGoalsCumulativeAmountController extends BaseController {
    private useCase: GetGoalsCumulativeAmountUseCase;

    constructor(useCase: GetGoalsCumulativeAmountUseCase) {
        super();
        this.useCase = useCase;
    }

    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
        try {
            const { id } = req.decoded;
            const { year, month } = req.params as any;
            const result = await this.useCase.execute({ id, year: Number(year), month: Number(month) });

            if (result.isLeft()) {
                const error = result.value;
                return this.fail(res, error.getErrorValue()?.message ?? String(error.getErrorValue()));
            }

            return this.ok<number>(res, result.value.getValue());
        } catch (err) {
            return this.fail(res, err as string | Error);
        }
    }
}
