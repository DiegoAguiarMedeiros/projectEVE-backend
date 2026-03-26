import { Pagination } from "../../../../shared/domain/Pagination";
import { ProcessedIncomes} from "../../domain";
import { Interface as IProcessedIncomesRepo } from "../../repos/Interface";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetAllResponse } from "./GetAllResponse";


export class GetAllUseCase implements UseCase<{ id: string; page: number; pageSize: number, orderBy: string, order: string, year: number, month: number }, Promise<GetAllResponse>> {
    private repo: IProcessedIncomesRepo;

    constructor(repo: IProcessedIncomesRepo) {
        this.repo = repo;
    }
    async execute({ id, page, pageSize, orderBy, order,year,month }: { id: string; page: number; pageSize: number, orderBy: string, order: string, year: number, month: number }): Promise<GetAllResponse> {

        const data = await this.repo.getAllByYearMonth(id,year,month, page, pageSize, orderBy, order);
        const totalItems = (await this.repo.getAllByYearMonth(id, year, month)).length;


        const totalPages = Math.ceil(totalItems / pageSize);
        const paginationResult = Pagination.create<ProcessedIncomes>({
            currentPage: page,
            pageSize,
            totalPages,
            totalItems,
            data: data,
        });

        if (paginationResult.isFailure) {
            return left(
                Result.fail<Pagination<ProcessedIncomes>>(paginationResult.getErrorValue().toString())
            ) as GetAllResponse;
        }

        return right(Result.ok<Pagination<ProcessedIncomes>>(
            paginationResult.getValue()
        ));
    }

}