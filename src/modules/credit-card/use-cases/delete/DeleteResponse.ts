import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { DeleteErrors } from "./DeleteErrors";

export type DeleteResponse = Either<
DeleteErrors.CanNotBeDeleted |
DeleteErrors.NotFound |
AppError.UnexpectedError |
Result<any>,
Result<void>
>