
import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result } from "../../../../../shared/core/Result";
import { Envelope } from "../../domain/Envelope";

export type GetByIdResponse = Either<
    AppError.UnexpectedError,
    Result<Envelope>
>