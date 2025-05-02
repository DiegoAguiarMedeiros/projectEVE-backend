import { Request, Response } from "express";
import { GetByIdUseCase } from "../../../../../application/useCases/envelope/getById/GetByIdUseCase";
import { UniqueEntityID } from "../../../../../domain/shared/UniqueEntityID";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { Envelope } from "../../../../../domain/entities/envelope/Envelope";
import { GetByIdDTO } from "../../../../../domain/dto/envelope";

export class GetByIdController extends BaseController {
    private useCase: GetByIdUseCase;

    constructor(useCase: GetByIdUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
        try {
            let params: any = req.params;
            const { id } = req.decoded;
            const dto: GetByIdDTO = {
                id: params.id,
                userId: id,
            }
            const result = await this.useCase.execute(dto);

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
                const dto: Envelope = result.value.getValue() as unknown as Envelope;
                return this.ok<Envelope>(res, dto);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}