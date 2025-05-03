
import { UpdateDTO } from "../../../../domain/dto/fixedExpense";
import { Interface as IFixedExpenseRepo } from "../../../../domain/repositories/fixedExpense/Interface";
import { Interface as IEnvelopeRepo } from "../../../../domain/repositories/envelope/Interface";
import { Balance } from "../../../../domain/shared/Balance";
import { AppError } from "../../../../domain/shared/core/AppError";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { Description } from "../../../../domain/shared/Description";
import { Id } from "../../../../domain/shared/Id";
import { PaymentDay } from "../../../../domain/shared/PaymentDay";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";
import { EnvelopeMap } from "../../../../shared/mappers/envelope";
import { FixedExpenseMap as Mapper } from "../../../../shared/mappers/fixedExpense";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";
import { EnvelopeDTO } from "../../../../domain/dto/envelope";


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

            const envelope = await this.envelopeRepo.getById(data.fieldUpdate.envelope.id, data.request.userId);

            if (!envelope) {
                return left(new UpdateErrors.EnvelopeNotFound(data.fieldUpdate.envelope.id)) as UpdateResponse;
            }

            const DescriptionOrError = Description.create({ description: data.fieldUpdate.description ? data.fieldUpdate.description : fixedExpense.description.value });
            DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

            const AmountOrError = Balance.create({ balance: data.fieldUpdate.amount ? data.fieldUpdate.amount : fixedExpense.amount.value });
            AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

            const PaymentDayOrError = PaymentDay.create({ paymentDay: data.fieldUpdate.paymentDay ? data.fieldUpdate.paymentDay : fixedExpense.paymentDay.value });
            PaymentDayOrError.isFailure ? console.error(PaymentDayOrError.getErrorValue()) : '';

            const dtoResult = Result.combine([
                 DescriptionOrError, AmountOrError, PaymentDayOrError
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }



            const envelopeDTO: EnvelopeDTO = EnvelopeMap.toDTO(envelope);
            if (data.fieldUpdate.envelope) fixedExpense.updateEnvelope(envelopeDTO)

            const description: Description = DescriptionOrError.getValue();
            if (data.fieldUpdate.description) fixedExpense.updateDescription(description)

            const amount: Balance = AmountOrError.getValue();
            if (data.fieldUpdate.amount) fixedExpense.updateAmount(amount)

            const paymentDay: PaymentDay = PaymentDayOrError.getValue();
            if (data.fieldUpdate.paymentDay) fixedExpense.updatepaymentDay(paymentDay)

            const updateDebt = await this.repo.update(data.request.id.toString(), data.request.userId.toString(), fixedExpense);
            if (updateDebt) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(data.request.id.toString())
            ) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}