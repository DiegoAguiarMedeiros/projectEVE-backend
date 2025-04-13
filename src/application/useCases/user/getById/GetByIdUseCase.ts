

import { Email } from "../../../../domain/entities/user/Email";
import { JWTToken, RefreshToken } from "../../../../domain/entities/user/JWT";
import { Password } from "../../../../domain/entities/user/Password";
import { User } from "../../../../domain/entities/user/User";
import { Interface as IUserRepo } from "../../../../domain/repositories/user/Interface";
import { AppError } from "../../../../domain/shared/core/AppError";
import { Either, left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { IAuthService } from "../../../../infrastructure/services/authService";
import { GetByIdDTO, GetByIdDTOResponse } from "./GetByIdDTO";
import { GetByIdUseCaseErrors } from "./GetByIdErrors";

type Response = Either<
  GetByIdUseCaseErrors.EmailDoesntExistError |
  AppError.UnexpectedError,
  Result<GetByIdDTOResponse>
>

export class GetByIdUseCase implements UseCase<GetByIdDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo;
    this.authService = authService
  }

  public async execute(request: GetByIdDTO): Promise<Response> {
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
          return left(new GetByIdUseCaseErrors.EmailDoesntExistError())
        }
        const passwordValid = await user.password.comparePassword(password.value);

        if (!passwordValid) {
          return left(new GetByIdUseCaseErrors.EmailDoesntExistError())
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

        return right(Result.ok<GetByIdDTOResponse>({
          accessToken,
          refreshToken
        }));
      } catch (error) {
        return left(new GetByIdUseCaseErrors.EmailDoesntExistError())
      }
    } catch (err) {
      if (err instanceof Error) {
        return left(new AppError.UnexpectedError("GetByIdUseCase: " + err.message));
      }
      return left(new AppError.UnexpectedError('GetByIdUseCase An unexpected error occurred'));
    }
  }
}