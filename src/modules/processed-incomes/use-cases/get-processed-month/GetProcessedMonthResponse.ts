
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { YearMonths } from "../../dtos";

export type GetProcessedMonthResponse = Either<
    AppError.UnexpectedError,
     Result<YearMonths>
>