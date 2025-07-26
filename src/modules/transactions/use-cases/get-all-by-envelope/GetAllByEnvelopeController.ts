import { Request, Response } from "express";
import { PaginationDTO } from "../../../../shared/infrastructure/http/dto/pagination";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { TransactionsDTO } from "../../dtos";
import { GetAllByEnvelopeUseCase } from "./GetAllByEnvelopeUseCase";
import { TransactionsMap as Mapper } from "../../mappers";
import { Transactions } from "../../domain";

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

            console.log("year", params.year);
            console.log("month", params.month);

            const result = await this.useCase.execute({ id, page, pageSize, orderBy, order, envelope: params.id, year: params.year, month: params.month });

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

                const data: PaginationDTO<Transactions> = result.value.getValue();
                return this.ok<PaginationDTO<TransactionsDTO>>(res, {
                    currentPage: data.currentPage,
                    pageSize: data.pageSize,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages,
                    data: data.data.map((item: any) => Mapper.toDTO(item)),
                });
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}