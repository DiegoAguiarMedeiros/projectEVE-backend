
import { Interface as IInvestmentsRepo } from "../../../../domain/repositories/investment/Interface";
import { Balance } from "../../../../domain/shared/Balance";
import { AppError } from "../../../../domain/shared/core/AppError";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { Description } from "../../../../domain/shared/Description";
import { InvestmentsMap } from "../../../../shared/mappers/investment";
import { UpdateDTO } from "./UpdateDTO";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";


export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: IInvestmentsRepo;

    constructor(repo: IInvestmentsRepo) {
        this.repo = repo;
    }
    async execute(request: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const investment = InvestmentsMap.toDomain(await this.repo.getById(request.id.toString(), request.userId.toString()));

            const DescriptionOrError = Description.create({ description: request.description ? request.description : investment.description.value });
            DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

            const AmountOrError = Balance.create({ balance: request.amount ? request.amount : investment.amount.value });
            AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

            const ProfitabilityOrError = Balance.create({ balance: request.profitability ? request.profitability : investment.profitability.value });
            ProfitabilityOrError.isFailure ? console.error(ProfitabilityOrError.getErrorValue()) : '';

            const dtoResult = Result.combine([
                DescriptionOrError, AmountOrError, ProfitabilityOrError
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }

            if (!investment) {
                return left(
                    new UpdateErrors.NotFound(request.id.toString())
                ) as UpdateResponse;
            }

            const description: Description = DescriptionOrError.getValue();
            if (request.description) investment.updateDescription(description)

            const amount: Balance = AmountOrError.getValue();
            if (request.amount) investment.updateAmount(amount)

            const profitability: Balance = ProfitabilityOrError.getValue();
            if (request.profitability) investment.updateProfitability(profitability)

            if (request.applicationDate) investment.updateApplicationDate(request.applicationDate)
            if (request.maturityDate) investment.updateMaturityDate(request.maturityDate)
            if (request.type) investment.updateType(request.type)
            if (request.status) investment.updateStatus(request.status)

            const updateDebt = await this.repo.update(request.id.toString(), request.userId.toString(), investment);
            if (updateDebt) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(request.id.toString())
            ) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}