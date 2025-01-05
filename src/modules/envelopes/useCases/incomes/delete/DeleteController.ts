import { Request, Response } from "express";
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { DeleteUseCase } from "./DeleteUseCase";
import { DeleteDTO } from "./DeleteDTO";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { DecodedExpressRequest } from "../../../../users/infra/http/models/decodedRequest";
import { DeleteErrors } from "./DeleteErrors";

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