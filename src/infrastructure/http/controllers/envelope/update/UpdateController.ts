import { Request, Response } from "express";
import { UniqueEntityID } from "../../../../../domain/shared/UniqueEntityID";
import { TextUtils } from "../../../../../shared/utils/TextUtils";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";
import { UpdateErrors } from "../../../../../application/useCases/envelope/update/UpdateErrors";
import { UpdateUseCase } from "../../../../../application/useCases/envelope/update/UpdateUseCase";
import { UpdateDTO } from "../../../../../domain/dto/envelope";

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
                active: req.body.active,
            }
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case UpdateErrors.NameAlreadyExist:
                        return this.conflict(res, error.getErrorValue())
                    case UpdateErrors.NotFound:
                        return this.conflict(res, error.getErrorValue())
                    case UpdateErrors.NameCanNotBeChanged:
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