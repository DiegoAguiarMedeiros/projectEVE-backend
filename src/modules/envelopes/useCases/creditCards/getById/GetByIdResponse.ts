import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result } from "../../../../../shared/core/Result";
import { CreditCard } from "../../../domain/creditCard";

export type GetByIdResponse = Either<
    AppError.UnexpectedError,
    Result<CreditCard>
>