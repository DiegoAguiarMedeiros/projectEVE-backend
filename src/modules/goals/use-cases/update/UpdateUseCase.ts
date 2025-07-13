
import { Interface as IGoalsRepo } from "../../repos/Interface";
import { Interface as IEnvelopeRepo } from "../../../envelopes/repos/Interface";
import { Balance } from "../../../../shared/domain/Balance";
import { AppError } from "../../../../shared/core/AppError";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Description } from "../../../../shared/domain/Description";
import { Percentage } from "../../../../shared/domain/Percentage";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";
import { UpdateDTO } from "../../dtos";


export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: IGoalsRepo;
    private envelopeRepo: IEnvelopeRepo;

    constructor(repo: IGoalsRepo, envelopeRepo: IEnvelopeRepo) {
        this.repo = repo;
        this.envelopeRepo = envelopeRepo;
    }
    async execute(data: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {
            const goals = await this.repo.getById(data.request.id.toString(), data.request.userId.toString());

            if (!goals) {
                return left(
                    new UpdateErrors.NotFound(data.request.id.toString())
                ) as UpdateResponse;
            }

            const DescriptionOrError = Description.create({ description: data.fieldUpdate.description ? data.fieldUpdate.description : goals.description.value });
            DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

            const AmountOrError = Balance.create({ balance: data.fieldUpdate.amount ? data.fieldUpdate.amount : goals.amount.value });
            AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';
            
            const AmountTotalOrError = Balance.create({ balance: data.fieldUpdate.amountTotal ? data.fieldUpdate.amountTotal : goals.amountTotal.value });
            AmountTotalOrError.isFailure ? console.error(AmountTotalOrError.getErrorValue()) : '';

            const PercentageOrError = Percentage.create({ percentage: data.fieldUpdate.percentage ? data.fieldUpdate.percentage : goals.percentage.value });
            PercentageOrError.isFailure ? console.error(PercentageOrError.getErrorValue()) : '';

            const dtoResult = Result.combine([
                DescriptionOrError, AmountOrError,AmountTotalOrError, PercentageOrError
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }

            const description: Description = DescriptionOrError.getValue();
            if (data.fieldUpdate.description) goals.updateDescription(description)

            const amount: Balance = AmountOrError.getValue();
            if (data.fieldUpdate.amount) goals.updateAmount(amount)
            
                const amountTotal: Balance = AmountTotalOrError.getValue();
            if (data.fieldUpdate.amountTotal) goals.updateAmountTotal(amountTotal)

            const percentage: Percentage = PercentageOrError.getValue();
            if (data.fieldUpdate.percentage) goals.updatePercentage(percentage)
            
            const deadline: Date = data.fieldUpdate.deadline;
            if (data.fieldUpdate.deadline) goals.updateDeadline(deadline)

            const updateGoals = await this.repo.update(data.request.id.toString(), goals);
            if (updateGoals) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(data.request.id.toString())
            ) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}