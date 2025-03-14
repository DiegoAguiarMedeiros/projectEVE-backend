import { Response } from "express";
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { GetAllUseCase } from "./GetAllUseCase";
import { DecodedExpressRequest } from "../../../../users/infra/http/models/decodedRequest";
import { Income } from "../../../domain/income";
import { IncomeMap } from "../../../mappers/incomeMap";
import { IncomeDTO } from "../../../dtos/incomeDTO";
import { Pagination } from "../../../domain/pagination";
import { ValueObject } from "../../../../../shared/domain/ValueObject";
import { PaginationDTO } from "../../../dtos/PaginationDTO";

export class GetAllController extends BaseController {
    private useCase: GetAllUseCase;

    constructor(useCase: GetAllUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
        try {
            const { id } = req.decoded;

            const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
            const orderBy = `${req.query.orderBy}` ;
            const order = `${req.query.order}`;

            const result = await this.useCase.execute({ id, page, pageSize,orderBy,order });

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
                const incomes: PaginationDTO<Income> = result.value.getValue();
                return this.ok<PaginationDTO<IncomeDTO>>(res, {
                    currentPage: incomes.currentPage,
                    pageSize: incomes.pageSize,
                    totalItems: incomes.totalItems,
                    totalPages: incomes.totalPages,
                    data: incomes.data.map((income: any) => IncomeMap.toDTO(income)),
                });
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}