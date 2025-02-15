import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result } from "../../../../../shared/core/Result";
import { Income } from "../../../domain/income";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
    Result<Income[]>
>