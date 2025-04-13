
import { Income } from "../../../../domain/entities/income/Income";
import { Pagination } from "../../../../domain/entities/pagination/Pagination";
import { Interface as IIncomesRepo } from "../../../../domain/repositories/income/Interface";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { GetAllResponse } from "./GetAllResponse";


export class GetAllUseCase implements UseCase<{ id: string; page: number; pageSize: number, orderBy: string, order: string }, Promise<GetAllResponse>> {
    private repo: IIncomesRepo;

    constructor(repo: IIncomesRepo) {
        this.repo = repo;
    }
    async execute({ id, page, pageSize, orderBy, order }: { id: string; page: number; pageSize: number, orderBy: string, order: string }): Promise<GetAllResponse> {
        const incomesPaged = await this.repo.getAll(id, page, pageSize, orderBy, order);
        const totalItems = (await this.repo.getAll(id)).length;


        const totalPages = Math.ceil(totalItems / pageSize);

        const paginationResult = Pagination.create<Income>({
            currentPage: page,
            pageSize,
            totalPages,
            totalItems,
            data: incomesPaged,
        });

        if (paginationResult.isFailure) {
            return left(
                Result.fail<Pagination<Income>>(paginationResult.getErrorValue().toString())
            ) as GetAllResponse;
        }

        return right(Result.ok<Pagination<Income>>(
            paginationResult.getValue()
        ));
    }

}