
import { LoginResponseDTO } from "../../../../domain/dto/user";
import { AppError } from "../../../../domain/shared/core/AppError";
import { Either, Result } from "../../../../domain/shared/core/Result";
import { LoginUseCaseErrors } from "./LoginErrors";

export type LoginResponse = Either<
  LoginUseCaseErrors.EmailDoesntExistError |
  AppError.UnexpectedError,
  Result<LoginResponseDTO>
>