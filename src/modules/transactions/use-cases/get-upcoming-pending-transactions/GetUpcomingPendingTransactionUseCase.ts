import { Pagination } from "../../../../shared/domain/Pagination";
import { Transactions } from "../../domain";
import { Interface as ITransactionsRepo } from "../../repos/Interface";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetUpcomingPendingTransactionResponse } from "./GetUpcomingPendingTransactionResponse";


export class GetUpcomingPendingTransactionUseCase implements UseCase<{ id: string; page: number; pageSize: number, orderBy: string, order: string, year?: number, month?: number }, Promise<GetUpcomingPendingTransactionResponse>> {
    private repo: ITransactionsRepo;

    constructor(repo: ITransactionsRepo) {
        this.repo = repo;
    }
    async execute({ id, page, pageSize, orderBy, order, year, month }: { id: string; page: number; pageSize: number, orderBy: string, order: string, year?: number, month?: number }): Promise<GetUpcomingPendingTransactionResponse> {

        const data = await this.repo.getUpcomingPendingTransaction(id, page, pageSize, orderBy, order, year, month);
        const totalItems = (await this.repo.getUpcomingPendingTransaction(id, undefined, undefined, undefined, undefined, year, month)).length;
    
        const totalPages = Math.ceil(totalItems / pageSize);
        const paginationResult = Pagination.create<Transactions>({
            currentPage: page,
            pageSize,
            totalPages,
            totalItems,
            data: data,
        });

        if (paginationResult.isFailure) {
            return left(
                Result.fail<Pagination<Transactions>>(paginationResult.getErrorValue().toString())
            ) as GetUpcomingPendingTransactionResponse;
        }

        return right(Result.ok<Pagination<Transactions>>(
            paginationResult.getValue()
        ));
    }

}