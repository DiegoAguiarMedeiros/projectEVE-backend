import { Request, Response } from "express";
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { GetAllCreditCardsUseCase } from "./GetAllCreditCardsUseCase";
import { GetAllCreditCardsDTOResponse } from "./GetAllCreditCardsDTO";
import { DecodedExpressRequest } from "../../../../users/infra/http/models/decodedRequest";

export class GetAllCreditCardsController extends BaseController {
    private useCase: GetAllCreditCardsUseCase;

    constructor(useCase: GetAllCreditCardsUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
        try {
            const { id } = req.decoded;
            const result = await this.useCase.execute(id);

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
                const dto: GetAllCreditCardsDTOResponse = result.value.getValue() as GetAllCreditCardsDTOResponse;
                return this.ok<GetAllCreditCardsDTOResponse>(res, dto);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}