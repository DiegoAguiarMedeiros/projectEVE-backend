
import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result } from "../../../../../shared/core/Result";
import { MonthlyEnvelope } from "../../domain";

export type GetByIdResponse = Either<
    AppError.UnexpectedError,
    Result<MonthlyEnvelope>
>