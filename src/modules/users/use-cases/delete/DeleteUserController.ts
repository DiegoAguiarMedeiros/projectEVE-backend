
import * as express from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { DecodedExpressRequest } from '../../../../shared/infrastructure/http/models/DecodedExpressRequest';
import { DeleteUserUseCase } from './DeleteUserUseCase';

export class DeleteUserController extends BaseController {
    private useCase: DeleteUserUseCase;

    constructor(useCase: DeleteUserUseCase) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
        try {
            const result = await this.useCase.execute({ userId: req.decoded.id });

            if (result.isLeft()) {
                const error = result.value;
                return this.fail(res, error.getErrorValue().message);
            }

            return this.ok(res);
        } catch (err) {
            return this.fail(res, err as string | Error);
        }
    }
}
