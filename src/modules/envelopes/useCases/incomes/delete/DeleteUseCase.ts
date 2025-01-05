import { AppError } from "../../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { IIncomesRepo } from "../../../repos/IncomesRepo";
import { DeleteDTO } from "./DeleteDTO";
import { DeleteErrors } from "./DeleteErrors";
import { DeleteResponse } from "./DeleteResponse";



export class DeleteUseCase implements UseCase<DeleteDTO, Promise<DeleteResponse>> {
    private repo: IIncomesRepo;

    constructor(repo: IIncomesRepo) {
        this.repo = repo;
    }
    async execute(request: DeleteDTO): Promise<DeleteResponse> {

        try {
            const creditCard = await this.repo.getById(request.id.toString(), request.userId.toString());

            if (!creditCard) {
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