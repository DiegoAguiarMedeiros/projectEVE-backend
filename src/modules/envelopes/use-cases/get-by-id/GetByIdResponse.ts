
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { Envelopes } from "../../domain/Envelopes";

export type GetByIdResponse = Either<
    AppError.UnexpectedError,
    Result<Envelopes>
>