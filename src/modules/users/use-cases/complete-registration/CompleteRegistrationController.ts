
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { CompleteRegistrationUseCase } from "./CompleteRegistrationUseCase";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import * as express from 'express'

export class CompleteRegistrationController extends BaseController {
    private useCase: CompleteRegistrationUseCase;

    constructor(useCase: CompleteRegistrationUseCase) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
        const { id } = req.decoded;

        try {
            const result = await this.useCase.execute(id);

            if (result.isLeft()) {
                const error = result.value;
                return this.fail(res, error.getErrorValue().message);
            } else {
                return this.ok(res);
            }
        } catch (err) {
            return this.fail(res, err as string | Error);
        }
    }
}
