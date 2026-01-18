
import * as express from 'express'
import { BaseController } from '../../../../shared/infrastructure/http/models/BaseController';
import { DecodedExpressRequest } from '../../../../shared/infrastructure/http/models/DecodedExpressRequest';
import { ChangePasswordUseCase } from './ChangePasswordUseCase';
import { ChangePasswordDTO } from './ChangePasswordDTO';
import { ChangePasswordErrors } from './ChangePasswordErrors';

export class ChangePasswordController extends BaseController {
    private useCase: ChangePasswordUseCase;

    constructor(useCase: ChangePasswordUseCase) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
        const dto: ChangePasswordDTO = {
            userId: req.decoded.id,
            currentPassword: req.body.currentPassword,
            newPassword: req.body.newPassword
        }

        try {
            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.constructor) {
                    case ChangePasswordErrors.IncorrectPasswordError:
                        return this.clientError(res, error.getErrorValue().message)
                    default:
                        return this.fail(res, error.getErrorValue().message);
                }

            } else {
                return this.ok(res);
            }

        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }
}
