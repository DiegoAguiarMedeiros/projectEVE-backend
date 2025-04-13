import { Interface as IDebtRepo} from "../../../../domain/repositories/debt/Interface";
import { AppError } from "../../../../domain/shared/core/AppError";
import { left, right, Result } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";
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