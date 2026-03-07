import { Interface as IIncomesRepo } from "../../repos/Interface";
import { AppError } from "../../../../shared/core/AppError";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";
import { DeleteAllDTO } from "./DeleteAllDTO";
import { DeleteAllErrors } from "./DeleteAllErrors";
import { DeleteAllResponse } from "./DeleteAllResponse";



export class DeleteAllUseCase implements UseCase<DeleteAllDTO, Promise<DeleteAllResponse>> {
    private repo: IIncomesRepo;
    private domainEvents: any;

    constructor(repo: IIncomesRepo, domainEvents: DomainEvents) {
        this.repo = repo;
        this.domainEvents = domainEvents;
    }

    async execute(request: DeleteAllDTO): Promise<DeleteAllResponse> {
        try {
            if (!request.ids || request.ids.length === 0) {
                return left(new DeleteAllErrors.NothingToDelete()) as DeleteAllResponse;
            }

            const allUserIncomes = await this.repo.getAll(request.userId);
            const found = allUserIncomes.filter(income =>
                request.ids.includes(income.id.toString())
            );

            found.forEach(income => income.delete());

            await this.repo.deleteAll(request.ids, request.userId);

            found.forEach(income => this.domainEvents.dispatchEventsForAggregate(income.id));

            return right(Result.ok<void>()) as DeleteAllResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteAllResponse;
        }
    }
}
