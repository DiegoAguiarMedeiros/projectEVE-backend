import { Request, Response } from "express";
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllDTO } from "./GetAllDTO";
import { DecodedExpressRequest } from "../../../../users/infra/http/models/decodedRequest";
import { PaginationDTO } from "../../../dtos/PaginationDTO";
import { InvestmentsDTO } from "../../../dtos/investmentDTO";
import { InvestmentsMap } from "../../../mappers/investmentMap";
import { Investments } from "../../../domain/investments";

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
                const investments: PaginationDTO<Investments> = result.value.getValue();
                return this.ok<PaginationDTO<InvestmentsDTO>>(res, {
                    currentPage: investments.currentPage,
                    pageSize: investments.pageSize,
                    totalItems: investments.totalItems,
                    totalPages: investments.totalPages,
                    data: investments.data.map((investment: any) => InvestmentsMap.toDTO(investment)),
                });
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}