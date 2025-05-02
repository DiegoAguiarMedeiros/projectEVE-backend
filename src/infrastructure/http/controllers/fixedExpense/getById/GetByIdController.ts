import { Response } from "express";
import { GetByIdUseCase } from "../../../../../application/useCases/fixedExpense/getById/GetByIdUseCase";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { FixedExpense } from "../../../../../domain/entities/fixedExpense/FixedExpense";
import { GetByIdDTO } from "../../../../../domain/dto/fixedExpense";


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
            const requestDTO: GetByIdDTO = {
                id: params.id,
                userId: id,
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
                const dto: FixedExpense = result.value.getValue();
                return this.ok<FixedExpense>(res, dto);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }

}