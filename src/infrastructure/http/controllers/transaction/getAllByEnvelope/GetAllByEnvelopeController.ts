import { Request, Response } from "express";
import { GetAllByEnvelopeUseCase } from "../../../../../application/useCases/transaction/getAllByEnvelope/GetAllByEnvelopeUseCase";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { Transaction } from "../../../../../domain/entities/transaction/Transaction";
import { TransactionDTO } from "../../../../../domain/dto/transaction";
import { PaginationDTO } from "../../../../../domain/dto/pagination";
import { TransactionMap as Mapper } from "../../../../../shared/mappers/transaction";
export class GetAllByEnvelopeController extends BaseController {
    private useCase: GetAllByEnvelopeUseCase;

    constructor(useCase: GetAllByEnvelopeUseCase) {
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

            const result = await this.useCase.execute({ id, page, pageSize, orderBy, order, envelope: params.id });

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

                const incomes: PaginationDTO<Transaction> = result.value.getValue();
                return this.ok<PaginationDTO<TransactionDTO>>(res, {
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