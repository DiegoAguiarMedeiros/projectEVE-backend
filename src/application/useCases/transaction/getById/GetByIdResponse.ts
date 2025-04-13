import { Transaction } from "../../../../domain/entities/transaction/Transaction";
import { AppError } from "../../../../domain/shared/core/AppError";
import { Either, Result } from "../../../../domain/shared/core/Result";

export type GetByIdResponse = Either<
    AppError.UnexpectedError,
    Result<Transaction>
>