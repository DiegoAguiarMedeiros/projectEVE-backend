
import { Pagination } from "../../../../shared/domain/Pagination";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";


export type GetTotalResponse = Either<
    AppError.UnexpectedError,
    Result<{total:number}>
>