import { PaymentMethod, TransactionsStatus } from "../../domain";
import { Interface as ITransactionsRepo } from "../../repos/Interface";
import { Interface as IEnvelopeRepo } from "../../../envelopes/repos/Interface";
import { Balance } from "../../../../shared/domain/Balance";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Description } from "../../../../shared/domain/Description";
import { Id } from "../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { AppError } from "../../../../shared/core/AppError";
import { TransactionsMap } from "../../mappers";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";
import { UpdateDTO } from "../../dtos";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";


export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: ITransactionsRepo;
    private domainEvents: any;

    constructor(repo: ITransactionsRepo, domainEvents: DomainEvents) {
        this.repo = repo;
        this.domainEvents = domainEvents;
    }
    async execute(data: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const transaction = await this.repo.getById(data.request.id.toString(), data.request.userId.toString());
            if (!transaction) {
                return left(
                    new UpdateErrors.NotFound(data.request.id.toString())
                ) as UpdateResponse;
            }

            const DescriptionOrError = Description.create({ description: data.fieldUpdate.description ? data.fieldUpdate.description : transaction.description.value });
            DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

            const AmountOrError = Balance.create({ balance: data.fieldUpdate.amount ? data.fieldUpdate.amount : transaction.amount.value });
            AmountOrError.isFailure ? console.error(AmountOrError.getErrorValue()) : '';

            const dtoResult = Result.combine([
                DescriptionOrError, AmountOrError
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }

            const description: Description = DescriptionOrError.getValue();
            const amount: Balance = AmountOrError.getValue();
            const date: Date = data.fieldUpdate.date ? data.fieldUpdate.date : transaction.date;
            const status: TransactionsStatus = data.fieldUpdate.status ? data.fieldUpdate.status : transaction.status;

            const oldAmount = transaction.amount;
            const oldStatus = transaction.status;

            if (data.fieldUpdate.description) transaction.updateDescription(description)
            if (data.fieldUpdate.amount) transaction.updateAmount(amount)
            if (data.fieldUpdate.date) transaction.updateDate(date)
            if (data.fieldUpdate.status) transaction.updateStatus(status)
            if (data.fieldUpdate.paymentMethod) transaction.updatePaymentMethod(data.fieldUpdate.paymentMethod)
            if (data.fieldUpdate.creditCardId !== undefined) {
                const creditCardId = data.fieldUpdate.creditCardId
                    ? Id.create(new UniqueEntityID(data.fieldUpdate.creditCardId)).getValue()
                    : undefined;
                transaction.updateCreditCardId(creditCardId);
            }

            transaction.update(transaction, oldAmount, transaction.amount, oldStatus, new UniqueEntityID(data.request.userId))


            const updateData = await this.repo.update(transaction.id.toString(), transaction);
            this.domainEvents.dispatchEventsForAggregate(transaction.id);
            if (updateData) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(transaction.id.toString())
            ) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}