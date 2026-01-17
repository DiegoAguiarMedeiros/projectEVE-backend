import { UseCase } from "../../../../shared/core/UseCase";
import { IAuthService } from "../../../../shared/infrastructure/services/authService";
import { Either, left, Result, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";

type Response = Either<AppError.UnexpectedError, Result<void>>;

export class LogoutUseCase implements UseCase<string, Promise<Response>> {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    public async execute(userId: string): Promise<Response> {
        try {
            await this.authService.deAuthenticateUser(userId);
            return right(Result.ok<void>());
        } catch (err) {
            return left(new AppError.UnexpectedError(err as any));
        }
    }
}
