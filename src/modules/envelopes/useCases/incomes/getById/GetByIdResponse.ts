import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result } from "../../../../../shared/core/Result";
import { Income } from "../../../domain/income";

export type GetByIdResponse = Either<
    AppError.UnexpectedError,
    Result<Income>
>