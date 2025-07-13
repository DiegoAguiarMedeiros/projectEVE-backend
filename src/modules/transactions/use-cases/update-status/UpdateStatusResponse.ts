import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { UpdateStatusErrors } from "./UpdateStatusErrors";

export type UpdateStatusResponse = Either<
    UpdateStatusErrors.UpdateError |
    UpdateStatusErrors.CanNotBeChanged |
    UpdateStatusErrors.NotFound |
    UpdateStatusErrors.AlreadyExist |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>