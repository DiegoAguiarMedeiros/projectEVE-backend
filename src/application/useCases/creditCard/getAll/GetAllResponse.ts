import { CreditCard } from "../../../../domain/entities/creditCard/CreditCard";
import { Pagination } from "../../../../domain/entities/pagination/Pagination";
import { AppError } from "../../../../domain/shared/core/AppError";
import { Either, Result } from "../../../../domain/shared/core/Result";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
    Result<Pagination<CreditCard>>
>