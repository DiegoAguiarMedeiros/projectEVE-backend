import { EnvelopeDTO } from "../../../../domain/dto/envelope/index.";
import { AppError } from "../../../../domain/shared/core/AppError";
import { Either, Result } from "../../../../domain/shared/core/Result";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
    Result<EnvelopeDTO[]>
>