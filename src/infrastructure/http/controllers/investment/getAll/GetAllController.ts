import { Request, Response } from "express";
import { GetAllUseCase } from "../../../../../application/useCases/investment/getAll/GetAllUseCase";
import { InvestmentsMap } from "../../../../../shared/mappers/investment";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { InvestmentsDTO } from "../../../../../domain/dto/investment";
import { PaginationDTO } from "../../../../../domain/dto/pagination";
import { Investment } from "../../../../../domain/entities/investment/Investment";

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
                const investment: PaginationDTO<Investment> = result.value.getValue();
                return this.ok<PaginationDTO<InvestmentsDTO>>(res, {
                    currentPage: investment.currentPage,
                    pageSize: investment.pageSize,
                    totalItems: investment.totalItems,
                    totalPages: investment.totalPages,
                    data: investment.data.map((investment: any) => InvestmentsMap.toDTO(investment)),
                });
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}