import { Interface as ICreditCardsRepo } from "../../repos/Interface";
import { AppError } from "../../../../shared/core/AppError";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DeleteAllResponse } from "./DeleteAllResponse";

export interface DeleteAllDTO {
    ids: string[];
    userId: string;
}

export class DeleteAllUseCase implements UseCase<DeleteAllDTO, Promise<DeleteAllResponse>> {
    private repo: ICreditCardsRepo;

    constructor(repo: ICreditCardsRepo) {
        this.repo = repo;
    }

    async execute(request: DeleteAllDTO): Promise<DeleteAllResponse> {
        try {
            await this.repo.deleteAll(request.ids, request.userId);
            return right(Result.ok<void>()) as DeleteAllResponse;
        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteAllResponse;
        }
    }
}
