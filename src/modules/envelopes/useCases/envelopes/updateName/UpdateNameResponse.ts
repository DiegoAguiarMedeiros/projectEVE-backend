import { AppError } from "../../../../../shared/core/AppError";
import { Either, Result } from "../../../../../shared/core/Result";
import { UpdateNameErrors } from "./UpdateNameErrors";

export type UpdateNameResponse = Either<
    UpdateNameErrors.UpdateError |
    UpdateNameErrors.NameCanNotBeChanged |
    UpdateNameErrors.NotFound |
    UpdateNameErrors.NameAlreadyExist |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>