
import { request } from "http";
import { UpdateDTO } from "../../dtos";
import { Percentage } from "../../../../../shared/domain/Percentage";
import { Interface as IMonthlyEnvelopeRepo } from "../../repos/Interface";
import { Balance } from "../../../../../shared/domain/Balance";
import { Color } from "../../../../../shared/domain/Color";
import { AppError } from "../../../../../shared/core/AppError";
import { left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Name } from "../../../../../shared/domain/Name";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";



export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: IMonthlyEnvelopeRepo;

    constructor(repo: IMonthlyEnvelopeRepo) {
        this.repo = repo;
    }
    async execute(data: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const monthlyEnvelope = await this.repo.getById(data.request.id.toString(), data.request.userId.toString());
            if (!monthlyEnvelope) {
                return left(
                    new UpdateErrors.NotFound(data.request.id.toString())
                ) as UpdateResponse;
            }


            const percentageOrError = Percentage.create({ percentage: data.fieldUpdate.percentage });



            const dtoResult = Result.combine([percentageOrError]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }
            
            const percentage: Percentage = percentageOrError.getValue();
            monthlyEnvelope.updatePercentage(percentage);


            const update = await this.repo.update(data.request.id.toString(), monthlyEnvelope);
            if (update) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(data.request.id.toString())
            ) as UpdateResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}