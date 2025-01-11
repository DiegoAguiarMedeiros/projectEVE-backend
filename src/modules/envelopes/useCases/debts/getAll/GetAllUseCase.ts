import { AppError } from "../../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Envelope } from "../../../domain/envelope";
import { EnvelopeMap } from "../../../mappers/envelopeMap";
import { IDebtRepo } from "../../../repos/DebtsRepo";
import { GetAllDTO } from "./GetAllDTO";
import { GetAllResponse } from "./GetAllResponse";


export class GetAllUseCase implements UseCase<string, Promise<GetAllResponse>> {
    private repo: IDebtRepo;

    constructor(repo: IDebtRepo) {
        this.repo = repo;
    }
    async execute(id: string): Promise<GetAllResponse> {

        const debts = await this.repo.getAll(id);

        return right(Result.ok<GetAllDTO>({
            debts
        }));
    }

}