
import { Pagination } from "../../../../shared/domain/Pagination";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { Debt } from "../../domain";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
     Result<Pagination<Debt>>
>