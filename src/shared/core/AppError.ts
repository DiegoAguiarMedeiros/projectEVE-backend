
import { Result } from "./Result";
import { UseCaseError } from "./UseCaseError";
import { MESSAGES } from "../constants/messages";

export namespace AppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor(err: any) {
      super(false, {
        message: MESSAGES.ERRORS.UNEXPECTED,
        error: err
      } as UseCaseError)
      console.error(`[AppError]: An unexpected error occurred`);
      console.error(err);
    }

    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}