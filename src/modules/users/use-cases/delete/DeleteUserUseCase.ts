
import { UseCase } from "../../../../shared/core/UseCase";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { Interface as IUserRepo } from "../../repos/Interface";

interface DeleteUserDTO {
    userId: string;
}

type Response = Either<
    AppError.UnexpectedError,
    Result<void>
>;

export class DeleteUserUseCase implements UseCase<DeleteUserDTO, Promise<Response>> {
    private userRepo: IUserRepo;

    constructor(userRepo: IUserRepo) {
        this.userRepo = userRepo;
    }

    public async execute(request: DeleteUserDTO): Promise<Response> {
        try {
            await this.userRepo.delete(request.userId);
            return right(Result.ok<void>()) as Response;
        } catch (err) {
            console.error(err);
            return left(new AppError.UnexpectedError(err)) as Response;
        }
    }
}
