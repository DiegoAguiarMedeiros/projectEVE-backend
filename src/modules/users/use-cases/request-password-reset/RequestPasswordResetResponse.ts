import { Either, Result } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';

export type RequestPasswordResetResponse = Either<
  AppError.UnexpectedError,
  Result<void>
>;
