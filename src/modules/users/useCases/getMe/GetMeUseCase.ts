

import { GetMeDTO, GetMeDTOResponse } from "./GetMeDTO";
import { GetMeUseCaseErrors } from "./GetMeErrors";
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
  GetMeUseCaseErrors.EmailDoesntExistError |
  AppError.UnexpectedError,
  Result<GetMeDTOResponse>
>

export class GetMeUserUseCase implements UseCase<GetMeDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo;
    this.authService = authService
  }

  public async execute(request: GetMeDTO): Promise<Response> {
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
        user = await this.userRepo.getUserByEmail(email);
        const userFound = !!user;

        if (!userFound) {
          return left(new GetMeUseCaseErrors.EmailDoesntExistError())
        }
        const passwordValid = await user.password.comparePassword(password.value);

        if (!passwordValid) {
          return left(new GetMeUseCaseErrors.EmailDoesntExistError())
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

        return right(Result.ok<GetMeDTOResponse>({
          accessToken,
          refreshToken
        }));
      } catch (error) {
        return left(new GetMeUseCaseErrors.EmailDoesntExistError())
      }
    } catch (err) {
      if (err instanceof Error) {
        return left(new AppError.UnexpectedError("GetMeUserUseCase: " + err.message));
      }
      return left(new AppError.UnexpectedError('GetMeUserUseCase An unexpected error occurred'));
    }
  }
}