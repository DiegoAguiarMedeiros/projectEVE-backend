import { Either, Result } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { ResetPasswordErrors } from './ResetPasswordErrors';

export type ResetPasswordResponse = Either<
  ResetPasswordErrors.InvalidOrExpiredTokenError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>;
