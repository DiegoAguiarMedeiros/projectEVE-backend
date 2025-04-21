import { Response } from "express";
import { UpdateUseCase } from "../../../../../application/useCases/fixedExpense/update/UpdateUseCase";
import { UpdateDTO } from "../../../../../application/useCases/fixedExpense/update/UpdateDTO";
import { UpdateErrors } from "../../../../../application/useCases/fixedExpense/update/UpdateErrors";
import { BaseController } from "../../shared/BaseController";
import { DecodedExpressRequest } from "../../shared/DecodedExpressRequest";

export class UpdateController extends BaseController {
    private useCase: UpdateUseCase;

    constructor(useCase: UpdateUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
        let dto: UpdateDTO = req.body as UpdateDTO;
        let params: any = req.params;
        const { id } = req.decoded;
        dto = {
            ...dto,
            id: params.id,
            userId: id,
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