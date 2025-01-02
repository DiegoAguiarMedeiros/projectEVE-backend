
import { Either, Result } from "../../../../shared/core/Result";
import { CreateErrors } from "./CreateErrors";
import { AppError } from "../../../../shared/core/AppError";

export type CreateResponse = Either<
  CreateErrors.EmailAlreadyExistsError |
  CreateErrors.NameTakenError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>