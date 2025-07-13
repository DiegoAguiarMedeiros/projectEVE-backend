import { Request, Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { PaginationDTO } from "../../../../shared/infrastructure/http/dto/pagination";
import { CreditCard } from "../../domain";
import { CreditCardDTO } from "../../dtos";
import { CreditCardMap } from "../../mappers";
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
                const creditCards: PaginationDTO<CreditCard> = result.value.getValue();
                return this.ok<PaginationDTO<CreditCardDTO>>(res, {
                    currentPage: creditCards.currentPage,
                    pageSize: creditCards.pageSize,
                    totalItems: creditCards.totalItems,
                    totalPages: creditCards.totalPages,
                    data: creditCards.data.map((creditCard: any) => CreditCardMap.toDTO(creditCard)),
                });
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}