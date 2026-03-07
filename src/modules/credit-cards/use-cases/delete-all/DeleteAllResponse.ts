import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";

export type DeleteAllResponse = Either<
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>
