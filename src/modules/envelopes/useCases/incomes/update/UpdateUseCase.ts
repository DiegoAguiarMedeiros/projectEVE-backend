import { AppError } from "../../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Id } from "../../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Balance } from "../../../domain/balance";
import { Debt } from "../../../domain/debt";
import { DebtsStatus } from "../../../domain/debtsStatus";
import { Description } from "../../../domain/description";
import { Flag } from "../../../domain/flag";
import { Flags } from "../../../domain/flags";
import { Name } from "../../../domain/name";
import { DebtMap } from "../../../mappers/debtMap";
import { IncomeMap } from "../../../mappers/incomeMap";
import { IIncomesRepo } from "../../../repos/IncomesRepo";
import { UpdateDTO } from "./UpdateDTO";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";


export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: IIncomesRepo;

    constructor(repo: IIncomesRepo) {
        this.repo = repo;
    }
    async execute(request: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const income = IncomeMap.toDomain(await this.repo.getById(request.id.toString(), request.userId.toString()));
            if (!income) {
                return left(
                    new UpdateErrors.NotFound(request.id.toString())
                ) as UpdateResponse;
            }

            const DescriptionOrError = Description.create({ description: request.description ? request.description : income.description.value });
            DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

            const AmountOrError = Balance.create({ balance: request.amount ? request.amount : income.amount.value });
            AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';


            const dtoResult = Result.combine([
                DescriptionOrError, AmountOrError,
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }

            const description: Description = DescriptionOrError.getValue();
            const amount: Balance = AmountOrError.getValue();
            const paymentDay: number = request.paymentDay ? request.paymentDay : income.paymentDay;




            if (request.description) income.updateDescription(description)
            if (request.amount) income.updateAmount(amount)
            if (request.paymentDay) income.updatePaymentDay(paymentDay)

            const updateIncome = await this.repo.update(request.id.toString(), request.userId.toString(), income);
            if (updateIncome) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(request.id.toString())
            ) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}