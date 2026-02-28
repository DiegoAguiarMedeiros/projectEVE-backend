import { randomBytes } from "crypto";

import { UseCase } from "../../../../shared/core/UseCase";
import { IAuthService } from "../../../../shared/infrastructure/services/authService";
import { Interface as IUserRepo } from "../../repos/Interface";
import { LoginUseCaseErrors } from "./LoginErrors";
import { LoginResponse } from "./LoginResponse";
import { left, Result, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { LoginDTO, LoginResponseDTO } from "../../dtos";
import { Email } from "../../domain/Email";
import { JWTToken, RefreshToken } from "../../domain/JWT";
import { Password } from "../../domain/Password";
import { User } from "../../domain/User";
import { emailService } from "../../../../shared/infrastructure/services/EmailService";


export class LoginUserUseCase implements UseCase<LoginDTO, Promise<LoginResponse>> {
  private repository: IUserRepo;
  private authService: IAuthService;

  constructor(repository: IUserRepo, authService: IAuthService) {
    this.repository = repository;
    this.authService = authService
  }

  public async execute(request: LoginDTO): Promise<LoginResponse> {
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

      try {
        user = await this.repository.getUserByEmail(email);
        const userFound = !!user;

        if (!userFound) {
          return left(new LoginUseCaseErrors.EmailDoesntExistError())
        }

        const passwordValid = await user.password.comparePassword(password.value);

        if (!passwordValid) {
          return left(new LoginUseCaseErrors.EmailDoesntExistError())
        }

        if (!user.isEmailVerified) {
          const newToken = randomBytes(32).toString('hex');
          const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
          user.setEmailVerificationToken(newToken, newExpiresAt);
          await this.repository.save(user);

          await emailService.sendVerificationEmail(
            user.email.value,
            user.name.value,
            newToken,
            request.locale
          );

          return left(new LoginUseCaseErrors.EmailNotVerifiedError());
        }

        const accessToken: JWTToken = this.authService.signJWT({
          name: user.name.value,
          email: user.email.value,
          isEmailVerified: user.isEmailVerified,
          id: user.id.toString(),
          adminUser: user.isAdminUser,
        });

        const refreshToken: RefreshToken = this.authService
          .createRefreshToken();

        user.setAccessToken(accessToken, refreshToken);

        await this.authService.saveAuthenticatedUser(user);

        return right(Result.ok<LoginResponseDTO>({
          accessToken,
          refreshToken
        }));
      } catch (error) {
        return left(new LoginUseCaseErrors.EmailDoesntExistError())
      }
    } catch (err) {
      if (err instanceof Error) {
        return left(new AppError.UnexpectedError("LoginUserUseCase: " + err.message));
      }
      return left(new AppError.UnexpectedError('LoginUserUseCase An unexpected error occurred'));
    }
  }
}
