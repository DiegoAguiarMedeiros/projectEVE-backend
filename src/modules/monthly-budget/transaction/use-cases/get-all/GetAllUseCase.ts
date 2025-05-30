import { Pagination } from "../../../../../shared/domain/Pagination";
import { Transaction} from "../../domain";
import { Interface as ITransactionRepo } from "../../repos/Interface";
import { left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { GetAllResponse } from "./GetAllResponse";


export class GetAllUseCase implements UseCase<{ id: string; page: number; pageSize: number, orderBy: string, order: string }, Promise<GetAllResponse>> {
    private repo: ITransactionRepo;

    constructor(repo: ITransactionRepo) {
        this.repo = repo;
    }
    async execute({ id, page, pageSize, orderBy, order }: { id: string; page: number; pageSize: number, orderBy: string, order: string }): Promise<GetAllResponse> {

        const data = await this.repo.getAll(id, page, pageSize, orderBy, order);
        const totalItems = (await this.repo.getAll(id)).length;


        const totalPages = Math.ceil(totalItems / pageSize);
        const paginationResult = Pagination.create<Transaction>({
            currentPage: page,
            pageSize,
            totalPages,
            totalItems,
            data: data,
        });

        if (paginationResult.isFailure) {
            return left(
                Result.fail<Pagination<Transaction>>(paginationResult.getErrorValue().toString())
            ) as GetAllResponse;
        }

        return right(Result.ok<Pagination<Transaction>>(
            paginationResult.getValue()
        ));
    }

}