import { Pagination } from "../../../../../shared/domain/Pagination";
import { Transaction } from "../../domain";
import { Interface as ITransactionRepo } from "../../repos/Interface";
import { left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { GetAllByEnvelopeResponse } from "./GetAllByEnvelopeResponse";


export class GetAllByEnvelopeUseCase implements UseCase<{ id: string; page: number; pageSize: number, orderBy: string, order: string, envelope: string }, Promise<GetAllByEnvelopeResponse>> {
    private repo: ITransactionRepo;

    constructor(repo: ITransactionRepo) {
        this.repo = repo;
    }
    async execute({ id, page, pageSize, orderBy, order,envelope }: { id: string; page: number; pageSize: number, orderBy: string, order: string, envelope: string }): Promise<GetAllByEnvelopeResponse> {

        const data = await this.repo.getAllByEnvelope(id, envelope, page, pageSize, orderBy, order);
        const totalItems = (await this.repo.getAllByEnvelope(id, envelope)).length;


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
            ) as GetAllByEnvelopeResponse;
        }

        return right(Result.ok<Pagination<Transaction>>(
            paginationResult.getValue()
        ));
    }

}