import { Investment } from "../../../../domain/entities/investment/Investment";
import { Pagination } from "../../../../domain/entities/pagination/Pagination";
import { AppError } from "../../../../domain/shared/core/AppError";
import { Either, Result } from "../../../../domain/shared/core/Result";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
    Result<Pagination<Investment>>
>