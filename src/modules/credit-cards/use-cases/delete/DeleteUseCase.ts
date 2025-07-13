import { Interface as ICreditCardRepo } from "../../repos/Interface";
import { AppError } from "../../../../shared/core/AppError";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { DeleteErrors } from "./DeleteErrors";
import { DeleteResponse } from "./DeleteResponse";
import { DeleteDTO } from "../../dtos";

export class DeleteUseCase implements UseCase<DeleteDTO, Promise<DeleteResponse>> {
    private repo: ICreditCardRepo;

    constructor(repo: ICreditCardRepo) {
        this.repo = repo;
    }
    async execute(request: DeleteDTO): Promise<DeleteResponse> {

        try {
            const creditCard = await this.repo.getById(request.id, request.userId);

            if (!creditCard) {
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