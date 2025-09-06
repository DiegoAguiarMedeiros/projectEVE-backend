import { Request, Response } from "express";
import { PaginationDTO } from "../../../../shared/infrastructure/http/dto/pagination";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { GetAnalyticsCurrentEnvelopesUseCase } from "./GetAnalyticsCurrentEnvelopesUseCase";
import { AnalyticsCurrentEnvelopesDTO } from "../../dtos";

export class GetAnalyticsCurrentEnvelopesController extends BaseController {
    private useCase: GetAnalyticsCurrentEnvelopesUseCase;

    constructor(useCase: GetAnalyticsCurrentEnvelopesUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
        try {
            const { id } = req.decoded;
            const params: any = req.params;

            const result = await this.useCase.execute({ id, year: params.year, month: params.month });

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

                return this.ok<AnalyticsCurrentEnvelopesDTO>(res, result.value.getValue());
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}