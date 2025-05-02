import { Request, Response } from "express";
import { UpdateUseCase } from "../../../../../application/useCases/income/update/UpdateUseCase";
import { TextUtils } from "../../../../../shared/utils/TextUtils";
import { UpdateErrors } from "../../../../../application/useCases/income/update/UpdateErrors";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { UniqueEntityID } from "../../../../../domain/shared/UniqueEntityID";
import { UpdateDTO } from "../../../../../domain/dto/income";

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
                description: req.body.description,
                amount: req.body.amount,
                paymentDay: req.body.paymentDay,
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