import { Pagination } from "../../../../shared/domain/Pagination";
import { Transactions } from "../../domain";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";

export type GetAllByEnvelopeResponse = Either<
    AppError.UnexpectedError,
    Result<Pagination<Transactions>>
>