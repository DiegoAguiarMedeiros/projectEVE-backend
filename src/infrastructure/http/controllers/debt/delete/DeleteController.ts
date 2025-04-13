import { Request, Response } from "express";
import { DeleteDTO } from "../../../../../application/useCases/debt/delete/DeleteDTO";
import { DeleteErrors } from "../../../../../application/useCases/debt/delete/DeleteErrors";
import { DeleteUseCase } from "../../../../../application/useCases/debt/delete/DeleteUseCase";
import { UniqueEntityID } from "../../../../../domain/shared/UniqueEntityID";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";

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
            id: new UniqueEntityID(params.id),
            userId: new UniqueEntityID(id),
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case DeleteErrors.NotFound:
                        return this.conflict(res, error.getErrorValue())
                    case DeleteErrors.CanNotBeDeleted:
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