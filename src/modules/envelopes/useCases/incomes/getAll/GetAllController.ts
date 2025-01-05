import { Request, Response } from "express";
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllDTO } from "./GetAllDTO";
import { DecodedExpressRequest } from "../../../../users/infra/http/models/decodedRequest";

export class GetAllController extends BaseController {
    private useCase: GetAllUseCase;

    constructor(useCase: GetAllUseCase) {
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
                const dto: GetAllDTO = result.value.getValue() as GetAllDTO;
                return this.ok<GetAllDTO>(res, dto);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}