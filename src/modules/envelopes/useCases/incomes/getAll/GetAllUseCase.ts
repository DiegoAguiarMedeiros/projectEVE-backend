import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { IIncomesRepo } from "../../../repos/IncomesRepo";
import { GetAllDTO } from "./GetAllDTO";
import { GetAllResponse } from "./GetAllResponse";


export class GetAllUseCase implements UseCase<string, Promise<GetAllResponse>> {
    private repo: IIncomesRepo;

    constructor(repo: IIncomesRepo) {
        this.repo = repo;
    }
    async execute(id: string): Promise<GetAllResponse> {
        const incomes = await this.repo.getAll(id);

        return right(Result.ok<GetAllDTO>({
            incomes
        }));
    }

}