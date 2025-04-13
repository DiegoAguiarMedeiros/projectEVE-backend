import { Interface as ITransactionRepo} from "../../../../domain/repositories/transaction/Interface";
import { Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { GetAllDTO } from "./GetAllDTO";
import { GetAllResponse } from "./GetAllResponse";


export class GetAllUseCase implements UseCase<string, Promise<GetAllResponse>> {
    private repo: ITransactionRepo;

    constructor(repo: ITransactionRepo) {
        this.repo = repo;
    }
    async execute(id: string): Promise<GetAllResponse> {

        const transaction = await this.repo.getAll(id);

        return right(Result.ok<GetAllDTO>({
            transaction
        }));
    }

}