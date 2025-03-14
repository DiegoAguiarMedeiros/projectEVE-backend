import { AppError } from "../../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Investments } from "../../../domain/investments";
import { Pagination } from "../../../domain/pagination";
import { IInvestmentsRepo } from "../../../repos/InvestmentsRepo";
import { GetAllDTO } from "./GetAllDTO";
import { GetAllResponse } from "./GetAllResponse";


export class GetAllUseCase implements UseCase<{ id: string; page: number; pageSize: number, orderBy: string, order: string }, Promise<GetAllResponse>> {
    private repo: IInvestmentsRepo;

    constructor(CreditCardRepo: IInvestmentsRepo) {
        this.repo = CreditCardRepo;
    }
    async execute({ id, page, pageSize, orderBy, order }: { id: string; page: number; pageSize: number, orderBy: string, order: string }): Promise<GetAllResponse> {
        const creditCardsPaged = await this.repo.getAll(id, page, pageSize, orderBy, order);
        const totalItems = (await this.repo.getAll(id)).length;

        const totalPages = Math.ceil(totalItems / pageSize);
        const paginationResult = Pagination.create<Investments>({
            currentPage: page,
            pageSize,
            totalPages,
            totalItems,
            data: creditCardsPaged,
        });

        if (paginationResult.isFailure) {
            return left(
                Result.fail<Pagination<Investments>>(paginationResult.getErrorValue().toString())
            ) as GetAllResponse;
        }

        return right(Result.ok<Pagination<Investments>>(
            paginationResult.getValue()
        ));
    }

}