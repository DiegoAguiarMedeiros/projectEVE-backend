import { Request, Response } from "express";
import { GetAllUseCase } from "./GetAllUseCase";
import { GoalsMap as Mapper } from "../../mappers";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { PaginationDTO } from "../../../../shared/infrastructure/http/dto/pagination";
import { Goals } from "../../domain/Goals";
import { GoalsDTO } from "../../dtos";

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
                const investment: PaginationDTO<Goals> = result.value.getValue();
                return this.ok<PaginationDTO<GoalsDTO>>(res, {
                    currentPage: investment.currentPage,
                    pageSize: investment.pageSize,
                    totalItems: investment.totalItems,
                    totalPages: investment.totalPages,
                    data: investment.data.map((investment: any) => Mapper.toDTO(investment)),
                });
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}