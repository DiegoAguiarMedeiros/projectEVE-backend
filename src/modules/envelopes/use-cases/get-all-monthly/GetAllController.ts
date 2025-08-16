import { Response } from "express";
import { GetAllUseCase } from "./GetAllUseCase";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { EnvelopesDTO } from "../../dtos";

export class GetAllController extends BaseController {
    private useCase: GetAllUseCase;

    constructor(useCase: GetAllUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
        try {
            const { id } = req.decoded;
            const { year, month } = req.params;
            const result = await this.useCase.execute({ id, year: Number(year), month: Number(month) });

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
                const dto: EnvelopesDTO[] = result.value.getValue() as EnvelopesDTO[];
                return this.ok<EnvelopesDTO[]>(res, dto);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}