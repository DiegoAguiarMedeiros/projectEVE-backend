
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { ToalByYearMonths } from "../../dtos";

export type GetTotalResponse = Either<
    AppError.UnexpectedError,
     Result<ToalByYearMonths>
>