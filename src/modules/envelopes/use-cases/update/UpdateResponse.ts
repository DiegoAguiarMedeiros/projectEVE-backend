
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { UpdateErrors } from "./UpdateErrors";

export type UpdateResponse = Either<
    UpdateErrors.UpdateError |
    UpdateErrors.NameCanNotBeChanged |
    UpdateErrors.NotFound |
    UpdateErrors.NameAlreadyExist |
    UpdateErrors.ExceedsTotalPercentageError |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>