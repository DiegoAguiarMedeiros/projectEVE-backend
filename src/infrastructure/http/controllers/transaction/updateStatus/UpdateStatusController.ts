import { Request, Response } from "express";
import { UpdateErrors } from "../../../../../application/useCases/transaction/update/UpdateErrors";
import { UpdateStatusUseCase } from "../../../../../application/useCases/transaction/updateStatus/UpdateStatusUseCase";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { UpdateStatusDTO } from "../../../../../domain/dto/transaction";

export class UpdateStatusController extends BaseController {
    private useCase: UpdateStatusUseCase;

    constructor(useCase: UpdateStatusUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
        const params: any = req.params;
        const { id } = req.decoded;
        const dto: UpdateStatusDTO = {
            request: {
                id: params.id,
                userId: id,
            },
            fieldUpdate: {
                status: req.body.status,
            }
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case UpdateErrors.AlreadyExist:
                        return this.conflict(res, error.getErrorValue())
                    case UpdateErrors.NotFound:
                        return this.conflict(res, error.getErrorValue())
                    case UpdateErrors.CanNotBeChanged:
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