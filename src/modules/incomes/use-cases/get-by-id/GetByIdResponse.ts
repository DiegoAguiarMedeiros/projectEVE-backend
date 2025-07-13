
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { Incomes } from "../../domain";

export type GetByIdResponse = Either<
    AppError.UnexpectedError,
    Result<Incomes>
>