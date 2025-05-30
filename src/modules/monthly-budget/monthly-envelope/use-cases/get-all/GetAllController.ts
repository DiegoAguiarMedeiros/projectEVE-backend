import {  Response } from "express";
import { BaseController } from "../../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { MonthlyEnvelopeDTO } from "../../dtos";
import { GetAllUseCase } from "./GetAllUseCase";

export class GetAllController extends BaseController {
    private useCase: GetAllUseCase;

    constructor(useCase: GetAllUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
        try {
            const { id } = req.decoded;
            const result = await this.useCase.execute(id);

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
                const dto: MonthlyEnvelopeDTO[] = result.value.getValue() as MonthlyEnvelopeDTO[];
                return this.ok<MonthlyEnvelopeDTO[]>(res, dto);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}