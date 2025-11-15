import { Pagination } from "../../../../shared/domain/Pagination";
import { ProcessedIncomes } from "../../domain";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
    Result<Pagination<ProcessedIncomes>>
>