
import { Pagination } from "../../../../shared/domain/Pagination";
import { Interface as ICreditCardRepo } from "../../repos/Interface";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetAllResponse } from "./GetAllResponse";
import { CreditCard } from "../../domain";


export class GetAllUseCase implements UseCase<{ id: string; page: number; pageSize: number, orderBy: string, order: string }, Promise<GetAllResponse>> {
    private repo: ICreditCardRepo;

    constructor(CreditCardRepo: ICreditCardRepo) {
        this.repo = CreditCardRepo;
    }
    async execute({ id, page, pageSize, orderBy, order }: { id: string; page: number; pageSize: number, orderBy: string, order: string }): Promise<GetAllResponse> {
        const creditCardsPaged = await this.repo.getAll(id,page,pageSize, orderBy, order);
        const totalItems = (await this.repo.getAll(id)).length;

        const totalPages = Math.ceil(totalItems / pageSize);

        const paginationResult = Pagination.create<CreditCard>({
            currentPage: page,
            pageSize,
            totalPages,
            totalItems,
            data: creditCardsPaged,
        });

        if (paginationResult.isFailure) {
            return left(
                Result.fail<Pagination<CreditCard>>(paginationResult.getErrorValue().toString())
            ) as GetAllResponse;
        }

        return right(Result.ok<Pagination<CreditCard>>(
            paginationResult.getValue()
        ));
    }

}