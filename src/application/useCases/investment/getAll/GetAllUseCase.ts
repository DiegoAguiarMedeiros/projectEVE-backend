
import { Investment } from "../../../../domain/entities/investment/Investment";
import { Pagination } from "../../../../domain/entities/pagination/Pagination";
import { Interface as IInvestmentsRepo} from "../../../../domain/repositories/investment/Interface";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
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
        const paginationResult = Pagination.create<Investment>({
            currentPage: page,
            pageSize,
            totalPages,
            totalItems,
            data: creditCardsPaged,
        });

        if (paginationResult.isFailure) {
            return left(
                Result.fail<Pagination<Investment>>(paginationResult.getErrorValue().toString())
            ) as GetAllResponse;
        }

        return right(Result.ok<Pagination<Investment>>(
            paginationResult.getValue()
        ));
    }

}