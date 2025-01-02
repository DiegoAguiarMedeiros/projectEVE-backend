
import { Either, Result } from "../../../../../shared/core/Result";
import { CreateCreditCardErrors } from "./CreateCreditCardErrors";
import { AppError } from "../../../../../shared/core/AppError";

export type CreateCreditCardResponse = Either<
  CreateCreditCardErrors.NameTakenError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>