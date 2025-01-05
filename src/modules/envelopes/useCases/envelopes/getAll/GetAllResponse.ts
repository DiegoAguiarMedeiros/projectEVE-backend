import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result } from "../../../../../shared/core/Result";
import { GetAllDTO } from "./GetAllDTO";

export type GetAllResponse = Either<
    AppError.UnexpectedError,
    Result<GetAllDTO>
>