
import { Interface as IProcessedIncomesRepo } from "../../repos/Interface";
import { Interface as IEnvelopesRepo } from "../../../envelopes/repos/Interface";
import { Balance } from "../../../../shared/domain/Balance";
import { Id } from "../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Description } from "../../../../shared/domain/Description";
import { AppError } from "../../../../shared/core/AppError";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";
import { UpdateDTO } from "../../dtos";
import type { DomainEvents } from "../../../../shared/domain/events/DomainEvents";


export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: IProcessedIncomesRepo;
    private envelopesRepo: IEnvelopesRepo;
    private domainEvents: any;

    constructor(repo: IProcessedIncomesRepo, envelopesRepo: IEnvelopesRepo, domainEvents: DomainEvents) {
        this.repo = repo;
        this.envelopesRepo = envelopesRepo;
        this.domainEvents = domainEvents;
    }
    async execute(data: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const processedIncome = await this.repo.getById(data.request.id.toString(), data.request.userId.toString());
            if (!processedIncome) {
                return left(
                    new UpdateErrors.NotFound(data.request.id.toString())
                ) as UpdateResponse;
            }

            const DescriptionOrError = Description.create({ description: data.fieldUpdate.description ? data.fieldUpdate.description : processedIncome.description.value });
            DescriptionOrError.isFailure ? console.error(DescriptionOrError.getErrorValue()) : '';

            const TotalIncomeProcessedOrError = Balance.create({ balance: data.fieldUpdate.totalIncomeProcessed ? data.fieldUpdate.totalIncomeProcessed : processedIncome.totalIncomeProcessed.value });
            TotalIncomeProcessedOrError.isFailure ? console.error(TotalIncomeProcessedOrError.getErrorValue()) : '';

            const dtoResult = Result.combine([
                DescriptionOrError, TotalIncomeProcessedOrError
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }

            const description: Description = DescriptionOrError.getValue();
            const totalIncomeProcessed: Balance = TotalIncomeProcessedOrError.getValue();

            if (data.fieldUpdate.description) processedIncome.updateDescription(description)
            if (data.fieldUpdate.totalIncomeProcessed) processedIncome.updateTotalIncomeProcessed(totalIncomeProcessed)

            if (data.fieldUpdate.envelopeId !== undefined) {
                if (data.fieldUpdate.envelopeId === null || data.fieldUpdate.envelopeId === '') {
                    processedIncome.updateEnvelopeId(undefined);
                } else {
                    const allEnvelopes = await this.envelopesRepo.getAll(data.request.userId.toString());
                    const matched = allEnvelopes.find(e => e.id.toString() === data.fieldUpdate.envelopeId);
                    if (matched) {
                        const envelopeIdOrError = Id.create(new UniqueEntityID(data.fieldUpdate.envelopeId));
                        processedIncome.updateEnvelopeId(envelopeIdOrError.getValue());
                    }
                }
            }

            processedIncome.updateIsReprocessed(data.fieldUpdate.isReprocessed)

            processedIncome.update();
            const updateData = await this.repo.update(processedIncome.id.toString(), processedIncome);
            if (updateData) {
                this.domainEvents.dispatchEventsForAggregate(processedIncome.id);
                return right(Result.ok<void>()) as UpdateResponse;
            };

            return left(new UpdateErrors.UpdateError(processedIncome.id.toString())) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}