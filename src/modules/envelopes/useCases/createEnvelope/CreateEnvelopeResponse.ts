
import { Either, Result } from "../../../../shared/core/Result";
import { CreateEnvelopeErrors } from "./CreateEnvelopeErrors";
import { AppError } from "../../../../shared/core/AppError";

export type CreateEnvelopeResponse = Either<
  CreateEnvelopeErrors.NameTakenError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>