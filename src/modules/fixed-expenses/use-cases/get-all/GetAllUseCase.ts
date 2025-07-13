
import { FixedExpense } from "../../domain/FixedExpense";
import { Pagination } from "../../../../shared/domain/Pagination";
import { Interface as IFixedExpensesRepo} from "../../repos/Interface";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetAllResponse } from "./GetAllResponse";


export class GetAllUseCase implements UseCase<{ id: string; page: number; pageSize: number, orderBy: string, order: string }, Promise<GetAllResponse>> {
    private repo: IFixedExpensesRepo;

    constructor(CreditCardRepo: IFixedExpensesRepo) {
        this.repo = CreditCardRepo;
    }
    async execute({ id, page, pageSize, orderBy, order }: { id: string; page: number; pageSize: number, orderBy: string, order: string }): Promise<GetAllResponse> {
        const fixedExpenses = await this.repo.getAll(id, page, pageSize, orderBy, order);
        const totalItems = (await this.repo.getAll(id)).length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const paginationResult = Pagination.create<FixedExpense>({
            currentPage: page,
            pageSize,
            totalPages,
            totalItems,
            data: fixedExpenses,
        });

        if (paginationResult.isFailure) {
            return left(
                Result.fail<Pagination<FixedExpense>>(paginationResult.getErrorValue().toString())
            ) as GetAllResponse;
        }

        return right(Result.ok<Pagination<FixedExpense>>(
            paginationResult.getValue()
        ));
    }

}