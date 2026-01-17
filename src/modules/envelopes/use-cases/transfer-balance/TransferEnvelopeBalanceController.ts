import { Response } from "express";
import { TransferEnvelopeBalanceUseCase } from "./TransferEnvelopeBalanceUseCase";
import { DecodedExpressRequest } from "../../../../shared/infrastructure/http/models/DecodedExpressRequest";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import { TextUtils } from "../../../../shared/utils/TextUtils";

import { TransferEnvelopeBalanceErrors } from "./TransferEnvelopeBalanceErrors";

export class TransferEnvelopeBalanceController extends BaseController {
    constructor(private useCase: TransferEnvelopeBalanceUseCase) {
        super();
    }

    async executeImpl(req: DecodedExpressRequest, res: Response): Promise<void | any> {
        const { fromEnvelopeId, toEnvelopeId, amount, year, month } = req.body;
        const { id: userId } = req.decoded;

        try {
            const result = await this.useCase.execute({
                userId,
                fromEnvelopeId: TextUtils.sanitize(fromEnvelopeId),
                toEnvelopeId: TextUtils.sanitize(toEnvelopeId),
                amount: Number(amount),
                year: Number(year),
                month: Number(month),
            });

            if (result.isLeft()) {
                const error = result.value;


                switch (error.constructor) {
                    case TransferEnvelopeBalanceErrors.EnvelopeNotFoundError:
                        return this.notFound(res, error.getErrorValue().message);
                    case TransferEnvelopeBalanceErrors.InvalidTransferError:
                    case TransferEnvelopeBalanceErrors.InsufficientFundsError:
                        return this.clientError(res, error.getErrorValue().message);
                    default:
                        return this.fail(res, error.getErrorValue().message);
                }
            }

            return this.ok(res);
        } catch (err) {
            return this.fail(res, err as string | Error)
        }
    }
}
