import { Pagination } from "../../../../shared/domain/Pagination";
import { Transactions } from "../../domain";
import { Interface as ITransactionsRepo } from "../../repos/Interface";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetAllByEnvelopeResponse } from "./GetAllByEnvelopeResponse";


export class GetAllByEnvelopeUseCase implements UseCase<{ id: string; page: number; pageSize: number, orderBy: string, order: string, envelope: string, year: number, month: number }, Promise<GetAllByEnvelopeResponse>> {
    private repo: ITransactionsRepo;

    constructor(repo: ITransactionsRepo) {
        this.repo = repo;
    }
    async execute({ id, page, pageSize, orderBy, order, envelope, year, month }: { id: string; page: number; pageSize: number, orderBy: string, order: string, envelope: string, year: number, month: number }): Promise<GetAllByEnvelopeResponse> {

        const data = await this.repo.getAllByEnvelope(id, envelope,year,month, page, pageSize, orderBy, order);
        const totalItems = (await this.repo.getAllByEnvelope(id, envelope,year,month)).length;


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
            ) as GetAllByEnvelopeResponse;
        }

        return right(Result.ok<Pagination<Transactions>>(
            paginationResult.getValue()
        ));
    }

}