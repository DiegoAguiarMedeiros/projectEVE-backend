import { PaymentMethod } from "../../../../domain/entities/transaction/PaymentMethod";
import { TransactionStatus } from "../../../../domain/entities/transaction/TransactionStatus";
import { TransactionType } from "../../../../domain/entities/transaction/TransactionType";
import { Interface as ITransactionRepo } from "../../../../domain/repositories/transaction/Interface";
import { Interface as IEnvelopeRepo } from "../../../../domain/repositories/envelope/Interface";
import { Balance } from "../../../../domain/shared/Balance";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { Description } from "../../../../domain/shared/Description";
import { Id } from "../../../../domain/shared/Id";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";
import { AppError } from "../../../../domain/shared/core/AppError";
import { TransactionMap } from "../../../../shared/mappers/transaction";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";
import { UpdateDTO } from "../../../../domain/dto/transaction";
import { EnvelopeDTO } from "../../../../domain/dto/envelope";
import { EnvelopeMap } from "../../../../shared/mappers/envelope";


export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: ITransactionRepo;
    private envelopeRepo: IEnvelopeRepo;

    constructor(repo: ITransactionRepo, envelopeRepo: IEnvelopeRepo) {
        this.repo = repo;
        this.envelopeRepo = envelopeRepo;
    }
    async execute(data: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const transaction = await this.repo.getById(data.request.id.toString(), data.request.userId.toString());
            if (!transaction) {
                return left(
                    new UpdateErrors.NotFound(data.request.id.toString())
                ) as UpdateResponse;
            }

            const envelope = await this.envelopeRepo.getById(data.fieldUpdate.envelope.id, data.request.userId);

            if (!envelope) {
                return left(new UpdateErrors.EnvelopeNotFound(data.fieldUpdate.envelope.id)) as UpdateResponse;
            }

            const DescriptionOrError = Description.create({ description: data.fieldUpdate.description ? data.fieldUpdate.description : transaction.description.value });
            DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

            const AmountOrError = Balance.create({ balance: data.fieldUpdate.amount ? data.fieldUpdate.amount : transaction.amount.value });
            AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

            const CreditCardIdOrError = Id.create(new UniqueEntityID(data.fieldUpdate.creditCardId ? data.fieldUpdate.creditCardId : transaction.creditCardId?.value));
            CreditCardIdOrError.isFailure ? console.error(CreditCardIdOrError.getErrorValue()) : '';

            const dtoResult = Result.combine([
                DescriptionOrError, AmountOrError, CreditCardIdOrError
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }

            const creditCardId: Id = CreditCardIdOrError.getValue();
            const description: Description = DescriptionOrError.getValue();
            const amount: Balance = AmountOrError.getValue();
            const paymentMethod: PaymentMethod = data.fieldUpdate.paymentMethod ? data.fieldUpdate.paymentMethod : transaction.paymentMethod;
            const date: Date = data.fieldUpdate.date ? data.fieldUpdate.date : transaction.date;
            const type: TransactionType = data.fieldUpdate.type ? data.fieldUpdate.type : transaction.type;
            const status: TransactionStatus = data.fieldUpdate.status ? data.fieldUpdate.status : transaction.status;

            if (data.fieldUpdate.creditCardId) {
                transaction.updateCreditCardId(creditCardId)
            } else {
                transaction.updateCreditCardId()
            }

            const envelopeDTO: EnvelopeDTO = EnvelopeMap.toDTO(envelope);
            if (data.fieldUpdate.envelope) transaction.updateEnvelope(envelopeDTO)
            if (data.fieldUpdate.description) transaction.updateDescription(description)
            if (data.fieldUpdate.amount) transaction.updateAmount(amount)
            if (data.fieldUpdate.paymentMethod) transaction.updatePaymentMethod(paymentMethod)
            if (data.fieldUpdate.date) transaction.updateDate(date)
            if (data.fieldUpdate.type) transaction.updateType(type)
            if (data.fieldUpdate.status) transaction.updateStatus(status)

            console.log('transaction', JSON.stringify(transaction));
            const updateData = await this.repo.update(transaction.id.value, transaction);
            if (updateData) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(transaction.id.value)
            ) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}