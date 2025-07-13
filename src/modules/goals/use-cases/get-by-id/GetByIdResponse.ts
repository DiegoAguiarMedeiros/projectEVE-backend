import { Goals } from "../../domain/Goals";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";


export type GetByIdResponse = Either<
    AppError.UnexpectedError,
    Result<Goals>
>