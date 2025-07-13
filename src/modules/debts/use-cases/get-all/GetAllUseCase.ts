
import { Pagination } from "../../../../shared/domain/Pagination";
import { Interface as IDebtRepo} from "../../repos/Interface";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetAllResponse } from "./GetAllResponse";
import { Debt } from "../../domain";


export class GetAllUseCase implements UseCase<{ id: string; page: number; pageSize: number, orderBy: string, order: string }, Promise<GetAllResponse>> {
    private repo: IDebtRepo;

    constructor(repo: IDebtRepo) {
        this.repo = repo;
    }
    async execute({ id, page, pageSize, orderBy, order }: { id: string; page: number; pageSize: number, orderBy: string, order: string }): Promise<GetAllResponse> {

        const debtsPaged = await this.repo.getAll(id, page, pageSize, orderBy, order);
        const totalItems = (await this.repo.getAll(id)).length;

        const totalPages = Math.ceil(totalItems / pageSize);

        const paginationResult = Pagination.create<Debt>({
            currentPage: page,
            pageSize,
            totalPages,
            totalItems,
            data: debtsPaged,
        });

        if (paginationResult.isFailure) {
            return left(
                Result.fail<Pagination<Debt>>(paginationResult.getErrorValue().toString())
            ) as GetAllResponse;
        }

        return right(Result.ok<Pagination<Debt>>(
            paginationResult.getValue()
        ));
    }

}