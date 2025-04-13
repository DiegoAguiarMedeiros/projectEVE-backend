import { CreditCard } from "../../../../domain/entities/creditCard/CreditCard";
import { AppError } from "../../../../domain/shared/core/AppError";
import { Either, Result } from "../../../../domain/shared/core/Result";

export type GetByIdResponse = Either<
    AppError.UnexpectedError,
    Result<CreditCard>
>