
import { AppError } from "../../../../domain/shared/core/AppError";
import { Either, Result } from "../../../../domain/shared/core/Result";
import { UpdateErrors } from "./UpdateErrors";

export type UpdateResponse = Either<
    UpdateErrors.UpdateError |
    UpdateErrors.CanNotBeChanged |
    UpdateErrors.NotFound |
    UpdateErrors.AlreadyExist |
    UpdateErrors.EnvelopeNotFound |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>