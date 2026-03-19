import { Interface as IProcessedIncomesRepo } from "../../repos/Interface";
import { AppError } from "../../../../shared/core/AppError";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DeleteByMonthResponse } from "./DeleteByMonthResponse";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";

export interface DeleteByMonthDTO {
    year: number;
    month: number;
    userId: string;
}

export class DeleteByMonthUseCase implements UseCase<DeleteByMonthDTO, Promise<DeleteByMonthResponse>> {
    private repo: IProcessedIncomesRepo;
    private domainEvents: any;

    constructor(repo: IProcessedIncomesRepo, domainEvents: DomainEvents) {
        this.repo = repo;
        this.domainEvents = domainEvents;
    }

    async execute({ year, month, userId }: DeleteByMonthDTO): Promise<DeleteByMonthResponse> {
        try {
            const items = await this.repo.getAllByYearMonth(userId, year, month);
            const ids = items.map(item => item.id.toString());

            items.forEach(item => item.delete());

            await this.repo.deleteAll(ids, userId);

            items.forEach(item => this.domainEvents.dispatchEventsForAggregate(item.id));

            return right(Result.ok<void>()) as DeleteByMonthResponse;
        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteByMonthResponse;
        }
    }
}
