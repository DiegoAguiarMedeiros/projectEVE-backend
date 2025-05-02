import { Pagination } from "../../../../domain/entities/pagination/Pagination";
import { Transaction } from "../../../../domain/entities/transaction/Transaction";
import { AppError } from "../../../../domain/shared/core/AppError";
import { Either, Result } from "../../../../domain/shared/core/Result";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
    Result<Pagination<Transaction>>
>