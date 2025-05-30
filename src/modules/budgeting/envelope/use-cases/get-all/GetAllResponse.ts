import { EnvelopeDTO } from "../../dtos";
import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result } from "../../../../../shared/core/Result";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
    Result<EnvelopeDTO[]>
>