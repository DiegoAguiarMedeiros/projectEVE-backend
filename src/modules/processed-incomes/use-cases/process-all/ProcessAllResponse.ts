import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { ProcessAllErrors } from "./ProcessAllErrors";

export type ProcessAllResponse = Either<
  ProcessAllErrors.NoIncomesFound |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>
