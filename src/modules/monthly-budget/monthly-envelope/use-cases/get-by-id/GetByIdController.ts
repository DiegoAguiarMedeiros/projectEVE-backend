import { Request, Response } from "express";
import { BaseController } from "../../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { GetByIdDTO } from "../../../../budgeting/envelope/dtos";
import { GetByIdUseCase } from "./GetByIdUseCase";
import { MonthlyEnvelope } from "../../domain";

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
            const dto: GetByIdDTO = {
                id: params.id,
                userId: id,
            }
            const result = await this.useCase.execute(dto);

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
                const dto: MonthlyEnvelope = result.value.getValue() as unknown as MonthlyEnvelope;
                return this.ok<MonthlyEnvelope>(res, dto);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}