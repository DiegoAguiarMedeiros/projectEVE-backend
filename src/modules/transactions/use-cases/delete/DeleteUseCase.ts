import { DeleteDTO } from "../../dtos";
import { Interface as ITransactionRepo} from "../../repos/Interface";
import { AppError } from "../../../../shared/core/AppError";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DeleteErrors } from "./DeleteErrors";
import { DeleteResponse } from "./DeleteResponse";



export class DeleteUseCase implements UseCase<DeleteDTO, Promise<DeleteResponse>> {
    private repo: ITransactionRepo;

    constructor(repo: ITransactionRepo) {
        this.repo = repo;
    }
    async execute(request: DeleteDTO): Promise<DeleteResponse> {

        try {
            const transaction = await this.repo.getById(request.id.toString(), request.userId.toString());

            if (!transaction) {
                return left(
                    new DeleteErrors.NotFound(request.id.toString())
                ) as DeleteResponse;
            }

            await this.repo.delete(request.id.toString());
            return right(Result.ok<void>()) as DeleteResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteResponse;
        }
    }

}