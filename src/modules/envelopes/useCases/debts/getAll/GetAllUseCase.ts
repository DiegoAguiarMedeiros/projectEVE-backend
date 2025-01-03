import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { IDebtRepo } from "../../../repos/DebtsRepo";
import { GetAllDTOResponse } from "./GetAllDTO";

type Response = Either<
    AppError.UnexpectedError,
    Result<GetAllDTOResponse>
>

export class GetAllUseCase implements UseCase<string, Promise<Response>> {
    private debtsRepo: IDebtRepo;

    constructor(debtsRepo: IDebtRepo) {
        this.debtsRepo = debtsRepo;
    }
    async execute(id: string): Promise<Response> {
        const debts = await this.debtsRepo.getAll(id);

        return right(Result.ok<GetAllDTOResponse>({
            debts
        }));
    }

}