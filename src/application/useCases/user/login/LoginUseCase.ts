

import { Email } from "../../../../domain/entities/user/Email";
import { JWTToken, RefreshToken } from "../../../../domain/entities/user/JWT";
import { Password } from "../../../../domain/entities/user/Password";
import { User } from "../../../../domain/entities/user/User";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { IAuthService } from "../../../../infrastructure/services/authService";
import { Interface as IUserRepo } from "../../../../domain/repositories/user/Interface";
import { LoginUseCaseErrors } from "./LoginErrors";
import { LoginResponse } from "./LoginResponse";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { AppError } from "../../../../domain/shared/core/AppError";
import { LoginDTO, LoginResponseDTO } from "../../../../domain/dto/user";


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