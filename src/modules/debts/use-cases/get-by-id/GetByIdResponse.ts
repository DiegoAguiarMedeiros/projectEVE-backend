
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { Debt } from "../../domain";

export type GetByIdResponse = Either<
    AppError.UnexpectedError,
    Result<Debt>
>