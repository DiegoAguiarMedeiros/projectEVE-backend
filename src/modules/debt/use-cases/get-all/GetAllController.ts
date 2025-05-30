import { Request, Response } from "express"
import { PaginationDTO } from "../../../../shared/infrastructure/http/dto/pagination";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { Debt } from "../../domain";
import { DebtDTO } from "../../dtos";
import { DebtMap } from "../../mappers";
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
            const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
            const orderBy = `${req.query.orderBy}`;
            const order = `${req.query.order}`;

            const result = await this.useCase.execute({ id, page, pageSize, orderBy, order });

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
                const debts: PaginationDTO<Debt> = result.value.getValue();
                return this.ok<PaginationDTO<DebtDTO>>(res, {
                    currentPage: debts.currentPage,
                    pageSize: debts.pageSize,
                    totalItems: debts.totalItems,
                    totalPages: debts.totalPages,
                    data: debts.data.map((debt: any) => DebtMap.toDTO(debt)),
                });
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}