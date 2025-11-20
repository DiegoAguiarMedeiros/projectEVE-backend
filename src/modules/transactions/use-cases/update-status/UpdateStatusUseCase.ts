import { TransactionsStatus } from "../../domain";
import { Interface as ITransactionsRepo } from "../../repos/Interface";
import { Interface as IEnvelopeRepo } from "../../../envelopes/repos/Interface";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { AppError } from "../../../../shared/core/AppError";
import { UpdateStatusErrors } from "./UpdateStatusErrors";
import { UpdateStatusResponse } from "./UpdateStatusResponse";
import { UpdateStatusDTO } from "../../dtos";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";


export class UpdateStatusUseCase implements UseCase<UpdateStatusDTO, Promise<UpdateStatusResponse>> {
    private repo: ITransactionsRepo;
    private envelopeRepo: IEnvelopeRepo;
    private domainEvents: any;

    constructor(repo: ITransactionsRepo, envelopeRepo: IEnvelopeRepo, domainEvents: DomainEvents) {
        this.repo = repo;
        this.envelopeRepo = envelopeRepo;
        this.domainEvents = domainEvents;
    }

    async execute(data: UpdateStatusDTO): Promise<Promise<UpdateStatusResponse>> {

        try {

            const transaction = await this.repo.getById(data.request.id, data.request.userId);
            if (!transaction) {
                return left(
                    new UpdateStatusErrors.NotFound(data.request.id)
                ) as UpdateStatusResponse;
            }

            const status: TransactionsStatus = data.fieldUpdate.status ? data.fieldUpdate.status : transaction.status;

            if (data.fieldUpdate.status) transaction.updateStatus(status)

            transaction.update(transaction, transaction.amount, transaction.amount, new UniqueEntityID(data.request.userId))

            await this.repo.updateStatus(transaction.id.toString(), transaction.status);

            this.domainEvents.dispatchEventsForAggregate(transaction.id);

            return right(Result.ok<void>()) as UpdateStatusResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateStatusResponse;
        }
    }

}