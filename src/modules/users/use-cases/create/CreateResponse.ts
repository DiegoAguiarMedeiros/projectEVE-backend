
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { CreateErrors } from "./CreateErrors";

export type CreateResponse = Either<
  CreateErrors.EmailAlreadyExistsError |
  CreateErrors.NameTakenError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>