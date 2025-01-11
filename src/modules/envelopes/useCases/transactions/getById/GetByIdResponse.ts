import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result } from "../../../../../shared/core/Result";
import { Transaction } from "../../../domain/transaction";

export type GetByIdResponse = Either<
    AppError.UnexpectedError,
    Result<Transaction>
>