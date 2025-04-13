import { Request, Response } from "express";
import { GetByIdDTOResquest } from "../../../../../application/useCases/income/getById/GetByIdDTO";
import { GetByIdUseCase } from "../../../../../application/useCases/income/getById/GetByIdUseCase";
import { UniqueEntityID } from "../../../../../domain/shared/UniqueEntityID";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { Income } from "../../../../../domain/entities/income/Income";

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
            const requestDTO: GetByIdDTOResquest = {
                Id: new UniqueEntityID(params.id),
                userId: new UniqueEntityID(id),
            }
            const result = await this.useCase.execute(requestDTO);

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
                const dto: Income = result.value.getValue();
                return this.ok<Income>(res, dto);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}