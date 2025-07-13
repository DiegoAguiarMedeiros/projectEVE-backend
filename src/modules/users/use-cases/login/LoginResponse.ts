
import { LoginResponseDTO } from "../../dtos";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { LoginUseCaseErrors } from "./LoginErrors";

export type LoginResponse = Either<
  LoginUseCaseErrors.EmailDoesntExistError |
  AppError.UnexpectedError,
  Result<LoginResponseDTO>
>