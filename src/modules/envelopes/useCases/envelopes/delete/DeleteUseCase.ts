import { AppError } from "../../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { IEnvelopeRepo } from "../../../repos/EnvelopeRepo";
import { DeleteDTO } from "./DeleteDTO";
import { DeleteErrors } from "./DeleteErrors";
import { DeleteResponse } from "./DeleteResponse";




export class DeleteUseCase implements UseCase<DeleteDTO, Promise<DeleteResponse>> {
    private repo: IEnvelopeRepo;

    constructor(repo: IEnvelopeRepo) {
        this.repo = repo;
    }
    async execute(request: DeleteDTO): Promise<DeleteResponse> {

        try {

            const envelope = await this.repo.getById(request.id.toString(), request.userId.toString());

            if (!envelope) {
                return left(
                    new DeleteErrors.NotFound(request.id.toString())
                ) as DeleteResponse;
            }

            if (envelope.is_editable) {
                await this.repo.delete(envelope.id.value);
                return right(Result.ok<void>()) as DeleteResponse;
            }

            return left(
                new DeleteErrors.CanNotBeDeleted(request.id.toString())
            ) as DeleteResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteResponse;
        }
    }

}