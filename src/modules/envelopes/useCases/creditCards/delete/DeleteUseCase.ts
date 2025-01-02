import { AppError } from "../../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { ICreditCardRepo } from "../../../repos/CreditCardRepo";
import { DeleteDTO } from "./DeleteDTO";
import { DeleteErrors } from "./DeleteErrors";

type Response = Either<
    DeleteErrors.CanNotBeDeleted |
    DeleteErrors.NotFound |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>


export class DeleteUseCase implements UseCase<DeleteDTO, Promise<Response>> {
    private repo: ICreditCardRepo;

    constructor(repo: ICreditCardRepo) {
        this.repo = repo;
    }
    async execute(request: DeleteDTO): Promise<Response> {

        try {

            const envelope = await this.repo.getById(request.id.toString(), request.userId.toString());

            if (!envelope) {
                return left(
                    new DeleteErrors.NotFound(request.id.toString())
                ) as Response;
            }

            return left(
                new DeleteErrors.CanNotBeDeleted(request.id.toString())
            ) as Response;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as Response;
        }
    }

}