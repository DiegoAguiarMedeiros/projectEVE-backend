import { UseCase } from '../../../../shared/core/UseCase';
import { AppError } from '../../../../shared/core/AppError';
import { left, right, Result } from '../../../../shared/core/Result';
import { Interface as IUserRepo } from '../../repos/Interface';
import { Password } from '../../domain/Password';
import { RedisPasswordResetService } from '../../../../shared/infrastructure/services/redis/redisPasswordResetService';
import { ResetPasswordDTO } from './ResetPasswordDTO';
import { ResetPasswordResponse } from './ResetPasswordResponse';
import { ResetPasswordErrors } from './ResetPasswordErrors';

export class ResetPasswordUseCase
  implements UseCase<ResetPasswordDTO, Promise<ResetPasswordResponse>>
{
  private userRepo: IUserRepo;
  private passwordResetService: RedisPasswordResetService;

  constructor(userRepo: IUserRepo, passwordResetService: RedisPasswordResetService) {
    this.userRepo = userRepo;
    this.passwordResetService = passwordResetService;
  }

  public async execute(request: ResetPasswordDTO): Promise<ResetPasswordResponse> {
    try {
      const userId = await this.passwordResetService.getUserIdByToken(request.token);

      if (!userId) {
        return left(new ResetPasswordErrors.InvalidOrExpiredTokenError()) as ResetPasswordResponse;
      }

      const user = await this.userRepo.getUserByUserId(userId);

      const newPasswordOrError = Password.create({ value: request.newPassword });

      if (newPasswordOrError.isFailure) {
        return left(
          Result.fail<void>(newPasswordOrError.getErrorValue().toString())
        ) as ResetPasswordResponse;
      }

      user.updatePassword(newPasswordOrError.getValue());

      await this.userRepo.save(user);

      await this.passwordResetService.deleteToken(request.token);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as ResetPasswordResponse;
    }
  }
}
