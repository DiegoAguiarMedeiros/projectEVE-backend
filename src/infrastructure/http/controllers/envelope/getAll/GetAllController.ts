import {  Response } from "express";
import { GetAllUseCase } from "../../../../../application/useCases/envelope/getAll/GetAllUseCase";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { EnvelopeDTO } from "../../../../../domain/dto/envelope/index.";

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
                const dto: EnvelopeDTO[] = result.value.getValue() as EnvelopeDTO[];
                return this.ok<EnvelopeDTO[]>(res, dto);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}