import { Debt } from "../../../../domain/entities/debt/Debt";
import { AppError } from "../../../../domain/shared/core/AppError";
import { Either, Result } from "../../../../domain/shared/core/Result";

export type GetByIdResponse = Either<
    AppError.UnexpectedError,
    Result<Debt>
>