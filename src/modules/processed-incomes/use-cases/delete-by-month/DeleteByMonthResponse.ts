import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";

export type DeleteByMonthResponse = Either<
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>
