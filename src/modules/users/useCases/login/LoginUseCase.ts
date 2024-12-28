

import { LoginDTO, LoginDTOResponse } from "./LoginDTO";
import { LoginUseCaseErrors } from "./LoginErrors";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { IUserRepo } from "../../repos/userRepo";
import { IAuthService } from "../../services/authService";
import { User } from "../../domain/user";
import { Email } from "../../domain/email";
import { Password } from "../../domain/password";
import { JWTToken, RefreshToken } from "../../domain/jwt";

type Response = Either<
  LoginUseCaseErrors.PasswordDoesntMatchError |
  LoginUseCaseErrors.NameDoesntExistError |
  AppError.UnexpectedError,
  Result<LoginDTOResponse>
>

export class LoginUserUseCase implements UseCase<LoginDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo;
    this.authService = authService
  }

  public async execute(request: LoginDTO): Promise<Response> {
    let user: User;
    let email: Email;
    let password: Password;

    try {

      const emailOrError = Email.create(request.email);
      const passwordOrError = Password.create({ value: request.password });
      const payloadResult = Result.combine([emailOrError, passwordOrError]);

      if (payloadResult.isFailure) {
        return left(Result.fail<any>(payloadResult.getErrorValue()))
      }

      email = emailOrError.getValue();
      password = passwordOrError.getValue();

      user = await this.userRepo.getUserByEmail(email);
      const userFound = !!user;

      if (!userFound) {
        return left(new LoginUseCaseErrors.NameDoesntExistError())
      }

      const passwordValid = await user.password.comparePassword(password.value);

      if (!passwordValid) {
        return left(new LoginUseCaseErrors.PasswordDoesntMatchError())
      }

      const accessToken: JWTToken = this.authService.signJWT({
        name: user.name.value,
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        id: user.id.value,
        adminUser: user.isAdminUser,
      });

      const refreshToken: RefreshToken = this.authService
        .createRefreshToken();

      user.setAccessToken(accessToken, refreshToken);

      await this.authService.saveAuthenticatedUser(user);

      return right(Result.ok<LoginDTOResponse>({
        accessToken,
        refreshToken
      }));
    } catch (err) {
      if (err instanceof Error) {
        return left(new AppError.UnexpectedError("LoginUserUseCase: " + err.message));
      }
      return left(new AppError.UnexpectedError('LoginUserUseCase An unexpected error occurred'));
    }
  }
}