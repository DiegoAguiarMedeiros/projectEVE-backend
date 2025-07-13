import { FixedExpense } from "../../domain/FixedExpense";
import { Pagination } from "../../../../shared/domain/Pagination";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
    Result<Pagination<FixedExpense>>
>