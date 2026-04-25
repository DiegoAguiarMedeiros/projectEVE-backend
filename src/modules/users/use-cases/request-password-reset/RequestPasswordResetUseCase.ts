import { randomBytes } from 'crypto';
import { UseCase } from '../../../../shared/core/UseCase';
import { AppError } from '../../../../shared/core/AppError';
import { left, right, Result } from '../../../../shared/core/Result';
import { Interface as IUserRepo } from '../../repos/Interface';
import { Email } from '../../domain/Email';
import { RedisPasswordResetService } from '../../../../shared/infrastructure/services/redis/redisPasswordResetService';
import { emailService } from '../../../../shared/infrastructure/services/EmailService';
import { RequestPasswordResetDTO } from './RequestPasswordResetDTO';
import { RequestPasswordResetResponse } from './RequestPasswordResetResponse';

export class RequestPasswordResetUseCase
  implements UseCase<RequestPasswordResetDTO, Promise<RequestPasswordResetResponse>>
{
  private userRepo: IUserRepo;
  private passwordResetService: RedisPasswordResetService;

  constructor(userRepo: IUserRepo, passwordResetService: RedisPasswordResetService) {
    this.userRepo = userRepo;
    this.passwordResetService = passwordResetService;
  }

  public async execute(request: RequestPasswordResetDTO): Promise<RequestPasswordResetResponse> {
    try {
      const emailOrError = Email.create(request.email);

      if (emailOrError.isFailure) {
        // Anti-enumeration: return ok even for invalid email format
        return right(Result.ok<void>());
      }

      const email = emailOrError.getValue();

      const userExists = await this.userRepo.exists(email);

      if (!userExists) {
        // Anti-enumeration: return ok even when user not found
        return right(Result.ok<void>());
      }

      const user = await this.userRepo.getUserByEmail(email);
      const token = randomBytes(32).toString('hex');

      await this.passwordResetService.saveToken(token, user.id.toString());

      await emailService.sendPasswordResetEmail(
        email.value,
        user.name.value,
        token,
        request.locale,
      );

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
