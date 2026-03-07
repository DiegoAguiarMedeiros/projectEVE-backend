import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { DeleteAllErrors } from "./DeleteAllErrors";

export type DeleteAllResponse = Either<
    DeleteAllErrors.NothingToDelete |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>
