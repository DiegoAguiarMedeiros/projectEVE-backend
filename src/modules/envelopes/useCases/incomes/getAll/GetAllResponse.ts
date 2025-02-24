import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result } from "../../../../../shared/core/Result";
import { Income } from "../../../domain/income";
import { Pagination } from "../../../domain/pagination";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
    Result<Pagination<Income>>
>