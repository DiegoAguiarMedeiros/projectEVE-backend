
import { Either, Result } from "../../../../domain/shared/core/Result";
import { CreateErrors } from "./CreateErrors";
import { AppError } from "../../../../domain/shared/core/AppError";

export type CreateResponse = Either<
  CreateErrors.NameTakenError |
  CreateErrors.EnvelopeNotFound |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>