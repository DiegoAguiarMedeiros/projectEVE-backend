import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { Transactions } from "../../domain";
import { CreateErrors } from "./CreateErrors";

export type CreateResponse = Either<
  CreateErrors.EnvelopeNotFound |
  AppError.UnexpectedError,
  Result<Transactions>
>