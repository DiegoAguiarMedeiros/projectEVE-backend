
import { Interface as IFixedExpenseRepo } from "../../repos/Interface";
import { Interface as IEnvelopeRepo } from "../../../envelopes/repos/Interface";
import { Balance } from "../../../../shared/domain/Balance";
import { AppError } from "../../../../shared/core/AppError";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Description } from "../../../../shared/domain/Description";
import { Id } from "../../../../shared/domain/Id";
import { PaymentDay } from "../../../../shared/domain/PaymentDay";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { FixedExpenseMap as Mapper } from "../../mappers";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";
import { UpdateDTO } from "../../dtos";


export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: IFixedExpenseRepo;
    private envelopeRepo: IEnvelopeRepo;

    constructor(repo: IFixedExpenseRepo, envelopeRepo: IEnvelopeRepo) {
        this.repo = repo;
        this.envelopeRepo = envelopeRepo;
    }
    async execute(data: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const fixedExpense = await this.repo.getById(data.request.id.toString(), data.request.userId.toString());

            if (!fixedExpense) {
                return left(
                    new UpdateErrors.NotFound(data.request.id.toString())
                ) as UpdateResponse;
            }

            const envelope = await this.envelopeRepo.getById(data.fieldUpdate.envelopeId, data.request.userId);

            if (!envelope) {
                return left(new UpdateErrors.EnvelopeNotFound(data.fieldUpdate.envelopeId)) as UpdateResponse;
            }

            const EnvelpeIdOrError = Id.create(new UniqueEntityID(data.fieldUpdate.envelopeId));
            EnvelpeIdOrError.isFailure ? console.error(EnvelpeIdOrError.getErrorValue()) : '';
            
            const DescriptionOrError = Description.create({ description: data.fieldUpdate.description ? data.fieldUpdate.description : fixedExpense.description.value });
            DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

            const AmountOrError = Balance.create({ balance: data.fieldUpdate.amount ? data.fieldUpdate.amount : fixedExpense.amount.value });
            AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

            const PaymentDayOrError = PaymentDay.create({ paymentDay: data.fieldUpdate.paymentDay ? data.fieldUpdate.paymentDay : fixedExpense.paymentDay.value });
            PaymentDayOrError.isFailure ? console.error(PaymentDayOrError.getErrorValue()) : '';

            const dtoResult = Result.combine([
                EnvelpeIdOrError, DescriptionOrError, AmountOrError, PaymentDayOrError
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }



            const envelopeId: Id = EnvelpeIdOrError.getValue();
            if (fixedExpense.envelopeId.value !== data.fieldUpdate.envelopeId) fixedExpense.updateEnvelopeId(envelopeId)

            const description: Description = DescriptionOrError.getValue();
            if (data.fieldUpdate.description) fixedExpense.updateDescription(description)

            const amount: Balance = AmountOrError.getValue();
            if (data.fieldUpdate.amount) fixedExpense.updateAmount(amount)

            const paymentDay: PaymentDay = PaymentDayOrError.getValue();
            if (data.fieldUpdate.paymentDay) fixedExpense.updatepaymentDay(paymentDay)

            const updateDebt = await this.repo.update(data.request.id.toString(), fixedExpense);
            if (updateDebt) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(data.request.id.toString())
            ) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}