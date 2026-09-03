import { Request, Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { UpdateDTO } from "../../dtos";
import { UpdateUseCase } from "./UpdateUseCase";
import { UpdateErrors } from "./UpdateErrors";

export class UpdateController extends BaseController {
    private useCase: UpdateUseCase;

    constructor(useCase: UpdateUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
        let params: any = req.params;
        const { id } = req.decoded;
        const dto: UpdateDTO = {
            request: {
                id: params.id,
                userId: id,
            },
            fieldUpdate: {
                name: req.body.name,
                color: req.body.color,
                percentage: req.body.percentage,
            }
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case UpdateErrors.NameAlreadyExist:
                        return this.conflict(res, error.getErrorValue().message)
                    case UpdateErrors.NotFound:
                        return this.conflict(res, error.getErrorValue().message)
                    case UpdateErrors.NameCanNotBeChanged:
                        return this.conflict(res, error.getErrorValue().message)
                    case UpdateErrors.BelowMinimumPercentageError:
                        return this.clientError(res, error.getErrorValue().message)
                    case UpdateErrors.ExceedsTotalPercentageError:
                        return this.clientError(res, error.getErrorValue().message)
                    default:
                        return this.fail(res, error.getErrorValue()?.message ?? error.getErrorValue());
                }

            } else {
                return this.ok(res);
            }

        } catch (err: any) {
            return this.fail(res, err?.message ?? err)
        }
    }

}