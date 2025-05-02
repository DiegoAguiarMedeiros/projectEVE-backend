import { Request, Response } from "express";
import { DeleteErrors } from "../../../../../application/useCases/transaction/delete/DeleteErrors";
import { DeleteUseCase } from "../../../../../application/useCases/transaction/delete/DeleteUseCase";
import { UniqueEntityID } from "../../../../../domain/shared/UniqueEntityID";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { DeleteDTO } from "../../../../../domain/dto/transaction";


export class DeleteController extends BaseController {

    private useCase: DeleteUseCase;

    constructor(useCase: DeleteUseCase) {
        super();
        this.useCase = useCase;
    }


    async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
        let params: any = req.params;
        const { id } = req.decoded;
        const dto: DeleteDTO = {
            id: params.id,
            userId: id,
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case DeleteErrors.NotFound:
                        return this.conflict(res, error.getErrorValue())
                    default:
                        return this.fail(res, error.getErrorValue());
                }

            } else {
                return this.ok(res);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }
}