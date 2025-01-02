import { Request, Response } from "express";
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { UpdateNameUseCase } from "./UpdateNameUseCase";
import { UpdateNameDTO, UpdateNameDTORequest } from "./UpdateNameDTO";
import { DecodedExpressRequest } from "../../../../users/infra/http/models/decodedRequest";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { TextUtils } from "../../../../../shared/utils/TextUtils";
import { UpdateNameErrors } from "./UpdateNameErrors";

export class UpdateNameController extends BaseController {
    private useCase: UpdateNameUseCase;

    constructor(useCase: UpdateNameUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
        let requestDTO: UpdateNameDTORequest = req.body as UpdateNameDTORequest;
        let params: any = req.params;
        const { id } = req.decoded;
        const dto: UpdateNameDTO = {
            id: new UniqueEntityID(params.id),
            userId: new UniqueEntityID(id),
            name: TextUtils.sanitize(requestDTO.name),
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case UpdateNameErrors.NameAlreadyExist:
                        return this.conflict(res, error.getErrorValue())
                    case UpdateNameErrors.NotFound:
                        return this.conflict(res, error.getErrorValue())
                    case UpdateNameErrors.NameCanNotBeChanged:
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