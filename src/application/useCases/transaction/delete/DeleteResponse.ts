import { AppError } from "../../../../domain/shared/core/AppError";
import { Either, Result } from "../../../../domain/shared/core/Result";
import { DeleteErrors } from "./DeleteErrors";

export type DeleteResponse = Either<
DeleteErrors.NotFound |
AppError.UnexpectedError |
Result<any>,
Result<void>
>