
import { UseCase } from "../../../../shared/core/UseCase";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { ChangePasswordDTO } from "./ChangePasswordDTO";
import { Interface as IUserRepo } from "../../repos/Interface";
import { Password } from "../../domain/Password";
import { ChangePasswordErrors } from "./ChangePasswordErrors";
import { IAuthService } from "../../../../shared/infrastructure/services/authService";

type Response = Either<
    ChangePasswordErrors.IncorrectPasswordError |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>;

export class ChangePasswordUseCase implements UseCase<ChangePasswordDTO, Promise<Response>> {
    private userRepo: IUserRepo;
    private authService?: IAuthService;

    constructor(userRepo: IUserRepo, authService?: IAuthService) {
        this.userRepo = userRepo;
        this.authService = authService;
    }

    public async execute(request: ChangePasswordDTO): Promise<Response> {
        try {
            const user = await this.userRepo.getUserByUserId(request.userId);

            const passwordValid = await user.password.comparePassword(request.currentPassword);

            if (!passwordValid) {
                return left(new ChangePasswordErrors.IncorrectPasswordError());
            }

            const newPasswordOrError = Password.create({ value: request.newPassword });

            if (newPasswordOrError.isFailure) {
                return left(Result.fail<void>(newPasswordOrError.getErrorValue().toString())) as Response;
            }

            user.updatePassword(newPasswordOrError.getValue());

            await this.userRepo.save(user);

            if (this.authService) {
                await this.authService.deAuthenticateUser(user.id.toString());
            }

            return right(Result.ok<void>()) as Response;
        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as Response;
        }
    }
}
