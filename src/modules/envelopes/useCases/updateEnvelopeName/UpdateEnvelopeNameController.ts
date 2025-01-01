import { Request, Response } from "express";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { UpdateEnvelopeNameUseCase } from "./UpdateEnvelopeNameUseCase";
import { UpdateEnvelopeNameDTO, UpdateEnvelopeNameDTORequest } from "./UpdateEnvelopeNameDTO";
import { DecodedExpressRequest } from "../../../users/infra/http/models/decodedRequest";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { TextUtils } from "../../../../shared/utils/TextUtils";
import { UpdateEnvelopeNameErrors } from "./UpdateEnvelopeNameErrors";

export class UpdateEnvelopeNameController extends BaseController {
    private useCase: UpdateEnvelopeNameUseCase;

    constructor(useCase: UpdateEnvelopeNameUseCase) {
        super();
        this.useCase = useCase;
    }
    protected async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
        let requestDTO: UpdateEnvelopeNameDTORequest = req.body as UpdateEnvelopeNameDTORequest;
        let params: any = req.params;
        const { id } = req.decoded;
        const dto: UpdateEnvelopeNameDTO = {
            id: new UniqueEntityID(params.id),
            userId: new UniqueEntityID(id),
            name: TextUtils.sanitize(requestDTO.name),
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case UpdateEnvelopeNameErrors.EnvelopeNameAlreadyExist:
                        return this.conflict(res, error.getErrorValue())
                    case UpdateEnvelopeNameErrors.EnvelopeNotFound:
                        return this.conflict(res, error.getErrorValue())
                    case UpdateEnvelopeNameErrors.EnvelopeNameCanNotBeChanged:
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