import { Request, Response } from "express";
import { UpdateStatusUseCase } from "./UpdateStatusUseCase";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { UpdateStatusDTO } from "../../dtos";
import { UpdateStatusErrors } from "./UpdateStatusErrors";

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
                    case UpdateStatusErrors.AlreadyExist:
                        return this.conflict(res, error.getErrorValue().message)
                    case UpdateStatusErrors.NotFound:
                        return this.conflict(res, error.getErrorValue().message)
                    case UpdateStatusErrors.CanNotBeChanged:
                        return this.conflict(res, error.getErrorValue().message)
                    case UpdateStatusErrors.ExceedsEnvelopeBudget:
                        return this.conflict(res, error.getErrorValue().message)
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