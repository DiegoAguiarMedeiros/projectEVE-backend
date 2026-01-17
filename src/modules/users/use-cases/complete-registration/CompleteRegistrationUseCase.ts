
import { AppError } from "../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { User } from "../../domain/User";
import { Interface as IUserRepo } from "../../repos/Interface";

type Response = Either<
    AppError.UnexpectedError,
    Result<void>
>;

export class CompleteRegistrationUseCase implements UseCase<string, Promise<Response>> {
    private userRepo: IUserRepo;

    constructor(userRepo: IUserRepo) {
        this.userRepo = userRepo;
    }

    public async execute(userId: string): Promise<Response> {
        try {
            const user = await this.userRepo.getUserByUserId(userId);
            user.completeRegistration();
            await this.userRepo.save(user);

            return right(Result.ok<void>());
        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as Response;
        }
    }
}
