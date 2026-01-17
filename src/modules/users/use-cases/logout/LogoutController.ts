import * as express from 'express';
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { LogoutUseCase } from "./LogoutUseCase";
import { isProduction } from "../../../../config";

export class LogoutController extends BaseController {
    private useCase: LogoutUseCase;

    constructor(useCase: LogoutUseCase) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
        const userId = req.decoded.id;

        try {
            await this.useCase.execute(userId);

            const cookieConfig: express.CookieOptions =
                isProduction
                    ? {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        path: '/',
                    }
                    : {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'strict',
                        path: '/',
                    };

            res.clearCookie('accessToken', cookieConfig);
            res.clearCookie('refreshToken', cookieConfig);

            return this.ok(res);
        } catch (err) {
            return this.fail(res, err as string | Error);
        }
    }
}
