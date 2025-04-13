import { AppError } from "../../../../domain/shared/core/AppError";
import { Either, Result } from "../../../../domain/shared/core/Result";
import { GetAllDTO } from "./GetAllDTO";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
    Result<GetAllDTO>
>