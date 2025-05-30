import { AppError } from "../../../../../shared/core/AppError";
import { DeleteErrors } from "./DeleteErrors";
import { DeleteResponse } from "./DeleteResponse";
import { left, right, Result } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Interface as IEnvelopeRepo} from "../../repos/Interface";
import { DeleteDTO } from "../../dtos";

export class DeleteUseCase implements UseCase<DeleteDTO, Promise<DeleteResponse>> {
    private repo: IEnvelopeRepo;

    constructor(repo: IEnvelopeRepo) {
        this.repo = repo;
    }
    async execute(request: DeleteDTO): Promise<DeleteResponse> {

        try {

            const envelope = await this.repo.getById(request.id, request.userId);

            if (!envelope) {
                return left(
                    new DeleteErrors.NotFound(request.id)
                ) as DeleteResponse;
            }

            return left(
                new DeleteErrors.CanNotBeDeleted(request.id)
            ) as DeleteResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as DeleteResponse;
        }
    }

}