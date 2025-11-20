
import { DeleteDTO } from "../../dtos";
import { Interface as IIncomesRepo } from "../../repos/Interface";
import { AppError } from "../../../../shared/core/AppError";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DeleteErrors } from "./DeleteErrors";
import { DeleteResponse } from "./DeleteResponse";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";



export class DeleteUseCase implements UseCase<DeleteDTO, Promise<DeleteResponse>> {
    private repo: IIncomesRepo;
    private domainEvents: any;

    constructor(repo: IIncomesRepo, domainEvents: DomainEvents) {
        this.repo = repo;
        this.domainEvents = domainEvents;
    }
    async execute(request: DeleteDTO): Promise<DeleteResponse> {

        try {
            const incomes = await this.repo.getById(request.id, request.userId);

            if (!incomes) {
                return left(
                    new DeleteErrors.NotFound(request.id)
                ) as DeleteResponse;
            }

            incomes.delete()
            const deleted = await this.repo.delete(request.id);

            this.domainEvents.dispatchEventsForAggregate(incomes.id);

            return right(Result.ok<void>()) as DeleteResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteResponse;
        }
    }

}