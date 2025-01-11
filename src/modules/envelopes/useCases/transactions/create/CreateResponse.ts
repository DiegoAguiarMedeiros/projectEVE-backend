
import { Either, Result } from "../../../../../shared/core/Result";
import { CreateErrors } from "./CreateErrors";
import { AppError } from "../../../../../shared/core/AppError";

export type CreateResponse = Either<
  CreateErrors.EnvelopeNotFound |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>