import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { IDebtRepo } from "../../../repos/DebtsRepo";
import { GetAllDTO } from "./GetAllDTO";
import { GetAllResponse } from "./GetAllResponse";


export class GetAllUseCase implements UseCase<string, Promise<GetAllResponse>> {
    private debtsRepo: IDebtRepo;

    constructor(debtsRepo: IDebtRepo) {
        this.debtsRepo = debtsRepo;
    }
    async execute(id: string): Promise<GetAllResponse> {
        const debts = await this.debtsRepo.getAll(id);

        return right(Result.ok<GetAllDTO>({
            debts
        }));
    }

}