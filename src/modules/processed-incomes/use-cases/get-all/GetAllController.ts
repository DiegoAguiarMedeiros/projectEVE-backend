import { Request, Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { ProcessedIncomesDTO } from "../../dtos";
import { PaginationDTO } from "../../../../shared/infrastructure/http/dto/pagination";
import { ProcessedIncomesMap as Mapper } from "../../mappers";
import { GetAllUseCase } from "./GetAllUseCase";
import { ProcessedIncomes } from "../../domain";

export class GetAllController extends BaseController {
    private useCase: GetAllUseCase;

    constructor(useCase: GetAllUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
        try {
            const { id } = req.decoded;
const params: any = req.params;
            const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
            const orderBy = `${req.query.orderBy}`;
            const order = `${req.query.order}`;

            const result = await this.useCase.execute({ id, page, pageSize, orderBy, order, year: params.year, month: params.month });

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

                const incomes: PaginationDTO<ProcessedIncomes> = result.value.getValue();
                return this.ok<PaginationDTO<ProcessedIncomesDTO>>(res, {
                    currentPage: incomes.currentPage,
                    pageSize: incomes.pageSize,
                    totalItems: incomes.totalItems,
                    totalPages: incomes.totalPages,
                    data: incomes.data.map((income: any) => Mapper.toDTO(income)),
                });
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}