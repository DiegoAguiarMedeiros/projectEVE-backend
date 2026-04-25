import { Result } from '../../../../shared/core/Result';
import { UseCaseError } from '../../../../shared/core/UseCaseError';

export namespace ResetPasswordErrors {
  export class InvalidOrExpiredTokenError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'auth.errors.reset_token_invalid_or_expired',
      } as UseCaseError);
    }
  }
}
