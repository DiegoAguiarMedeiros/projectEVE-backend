import {  Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { GetAnalyticsEnvelopesMonthOverviewUseCase } from "./GetAnalyticsEnvelopesMonthOverviewUseCase";
import { AnalyticsEnvelopesMonthOverviewDTO } from "../../dtos";

export class GetAnalyticsEnvelopesMonthOverviewController extends BaseController {
    private useCase: GetAnalyticsEnvelopesMonthOverviewUseCase;

    constructor(useCase: GetAnalyticsEnvelopesMonthOverviewUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
        try {
            const { id } = req.decoded;
            const params: any = req.params;

            const result = await this.useCase.execute({ id, year: params.year, month: params.month});

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

                return this.ok<AnalyticsEnvelopesMonthOverviewDTO[]>(res, result.value.getValue());
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}