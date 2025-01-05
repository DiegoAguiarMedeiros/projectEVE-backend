import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result } from "../../../../../shared/core/Result";
import { Debt } from "../../../domain/debt";

export type GetByIdResponse = Either<
    AppError.UnexpectedError,
    Result<Debt>
>