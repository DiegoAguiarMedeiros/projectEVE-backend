
import { Interface as IIncomesRepo } from "../../repos/Interface";
import { Balance } from "../../../../shared/domain/Balance";
import { Description } from "../../../../shared/domain/Description";
import { AppError } from "../../../../shared/core/AppError";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";
import { PaymentDay } from "../../../../shared/domain/PaymentDay";
import { UpdateDTO } from "../../dtos";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";

export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: IIncomesRepo;

    constructor(repo: IIncomesRepo) {
        this.repo = repo;
    }
    async execute(data: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {
            const income = await this.repo.getById(data.request.id.toString(), data.request.userId.toString());
            if (!income) {
                return left(
                    new UpdateErrors.NotFound(data.request.id.toString())
                ) as UpdateResponse;
            }
            const DescriptionOrError = Description.create({ description: data.fieldUpdate.description ? data.fieldUpdate.description : income.description.value });
            DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

            const AmountOrError = Balance.create({ balance: data.fieldUpdate.amount ? data.fieldUpdate.amount : income.amount.value });
            AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

            const PaymentDayOrError = PaymentDay.create({ paymentDay: data.fieldUpdate.paymentDay ? data.fieldUpdate.paymentDay : income.paymentDay.value });
            PaymentDayOrError.isFailure ? console.error(PaymentDayOrError.getErrorValue()) : '';

            const dtoResult = Result.combine([
                DescriptionOrError, AmountOrError, PaymentDayOrError
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }

            const description: Description = DescriptionOrError.getValue();
            const amount: Balance = AmountOrError.getValue();
            const paymentDay: PaymentDay = PaymentDayOrError.getValue();

            if (data.fieldUpdate.description) income.updateDescription(description)
            if (data.fieldUpdate.amount) income.updateAmount(amount)
            if (data.fieldUpdate.paymentDay) income.updatepaymentDay(paymentDay)

            income.markUpdated();

            const updateIncome = await this.repo.update(data.request.id.toString(), income);
            if (updateIncome) {
                DomainEvents.dispatchEventsForAggregate(income.id);
                return right(Result.ok<void>()) as UpdateResponse;
            }

            return left(
                new UpdateErrors.UpdateError(data.request.id.toString())
            ) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}