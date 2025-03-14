import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result } from "../../../../../shared/core/Result";
import { Investments } from "../../../domain/investments";
import { Pagination } from "../../../domain/pagination";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
    Result<Pagination<Investments>>
>