import { Request, Response } from "express"
import { GetAllUseCase } from "../../../../../application/useCases/debt/getAll/GetAllUseCase";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { DebtDTO } from "../../../../../domain/dto/debt";
import { PaginationDTO } from "../../../../../domain/dto/pagination";
import { Debt } from "../../../../../domain/entities/debt/Debt";
import { DebtMap } from "../../../../../shared/mappers/debt";

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