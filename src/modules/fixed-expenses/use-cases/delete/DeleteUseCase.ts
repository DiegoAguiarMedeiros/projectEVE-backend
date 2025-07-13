
import { Interface as IFixedExpenseRepo} from "../../repos/Interface";
import { AppError } from "../../../../shared/core/AppError";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DeleteErrors } from "./DeleteErrors";
import { DeleteResponse } from "./DeleteResponse";
import { DeleteDTO } from "../../dtos";



export class DeleteUseCase implements UseCase<DeleteDTO, Promise<DeleteResponse>> {
    private repo: IFixedExpenseRepo;

    constructor(repo: IFixedExpenseRepo) {
        this.repo = repo;
    }
    async execute(request: DeleteDTO): Promise<DeleteResponse> {

        try {
            const investment = await this.repo.getById(request.id, request.userId);

            if (!investment) {
                return left(
                    new DeleteErrors.NotFound(request.id)
                ) as DeleteResponse;
            }

            await this.repo.delete(request.id);
            return right(Result.ok<void>()) as DeleteResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteResponse;
        }
    }

}