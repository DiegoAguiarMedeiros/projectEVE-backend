import { Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { GetTotalUseCase } from "./GetTotalUseCase";

export class GetTotalController extends BaseController {
    private useCase: GetTotalUseCase;

    constructor(useCase: GetTotalUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
        try {
            const { id } = req.decoded;

            const result = await this.useCase.execute({ userId:id });

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
                
                const incomes = result.value.getValue();
                return this.ok<{total:number}>(res, incomes);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}