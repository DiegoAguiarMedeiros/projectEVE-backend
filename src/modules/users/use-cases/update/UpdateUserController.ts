
import * as express from 'express'
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { DecodedExpressRequest } from '../../../../shared/infrastructure/http/models/DecodedExpressRequest';
import { UpdateUserUseCase } from './UpdateUserUseCase';
import { UpdateUserDTO } from './UpdateUserDTO';
import { TextUtils } from '../../../../shared/utils/TextUtils';

export class UpdateUserController extends BaseController {
    private useCase: UpdateUserUseCase;

    constructor(useCase: UpdateUserUseCase) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
        const dto: UpdateUserDTO = {
            userId: req.decoded.id,
            name: TextUtils.sanitize(req.body.name)
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;
                return this.fail(res, error.getErrorValue().message);
            } else {
                return this.ok(res);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }
}
