import {  Response } from "express";
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { GetAllUseCase } from "./GetAllUseCase";
import { DecodedExpressRequest } from "../../../../users/infra/http/models/decodedRequest";
import { Income } from "../../../domain/income";
import { IncomeMap } from "../../../mappers/incomeMap";
import { IncomeDTO } from "../../../dtos/incomeDTO";

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
                const incomes: Income[] = result.value.getValue();
                return this.ok<IncomeDTO[]>(res, incomes.map((income:any) => IncomeMap.toDTO(income)));
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}