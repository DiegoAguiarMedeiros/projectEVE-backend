import { Request, Response } from "express"
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { GetProcessedMonthUseCase } from "./GetProcessedMonthUseCase";
import { GetProcessedMonthResponse } from "./GetProcessedMonthResponse";
import { YearMonths } from "../../dtos";

export class GetProcessedMonthController extends BaseController {
    private useCase: GetProcessedMonthUseCase;

    constructor(useCase: GetProcessedMonthUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
        try {
            const { id } = req.decoded;
            const result = await this.useCase.execute({ userId: id });
            console.log("result", result)
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
                const dto: YearMonths = result.value.getValue() as YearMonths;
                return this.ok<YearMonths>(res, dto);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}