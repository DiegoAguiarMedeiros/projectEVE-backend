
import { Pagination } from "../../../../shared/domain/Pagination";
import { Interface as IIncomesRepo } from "../../repos/Interface";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetAllResponse } from "./GetAllResponse";
import { Incomes } from "../../domain";


export class GetAllUseCase implements UseCase<{ id: string; page: number; pageSize: number, orderBy: string, order: string }, Promise<GetAllResponse>> {
    private repo: IIncomesRepo;

    constructor(repo: IIncomesRepo) {
        this.repo = repo;
    }
    async execute({ id, page, pageSize, orderBy, order }: { id: string; page: number; pageSize: number, orderBy: string, order: string }): Promise<GetAllResponse> {
        const incomesPaged = await this.repo.getAll(id, page, pageSize, orderBy, order);
        const totalItems = (await this.repo.getAll(id)).length;


        const totalPages = Math.ceil(totalItems / pageSize);

        const paginationResult = Pagination.create<Incomes>({
            currentPage: page,
            pageSize,
            totalPages,
            totalItems,
            data: incomesPaged,
        });

        if (paginationResult.isFailure) {
            return left(
                Result.fail<Pagination<Incomes>>(paginationResult.getErrorValue().toString())
            ) as GetAllResponse;
        }

        return right(Result.ok<Pagination<Incomes>>(
            paginationResult.getValue()
        ));
    }

}