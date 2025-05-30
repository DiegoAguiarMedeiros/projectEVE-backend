
import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result } from "../../../../../shared/core/Result";
import { MonthlyEnvelopeDTO } from "../../dtos";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
    Result<MonthlyEnvelopeDTO[]>
>