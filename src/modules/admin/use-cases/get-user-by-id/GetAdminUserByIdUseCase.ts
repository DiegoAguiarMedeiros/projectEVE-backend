import { UseCase } from '../../../../shared/core/UseCase';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { Interface as IUserRepo } from '../../../users/repos/Interface';
import { AdminUserDTO } from '../../dtos';
import models from '../../../../shared/infrastructure/database/sequelize/models';

interface GetAdminUserByIdRequest {
  userId: string;
}

type Response = Either<AppError.UnexpectedError, Result<AdminUserDTO>>;

export class GetAdminUserByIdUseCase implements UseCase<GetAdminUserByIdRequest, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(request: GetAdminUserByIdRequest): Promise<Response> {
    try {
      const user = await this.userRepo.getUserByUserId(request.userId);

      if (!user) {
        return left(new AppError.UnexpectedError('User not found'));
      }

      const raw = await models.Users.findOne({
        where: { id: request.userId },
        raw: true,
      });

      const dto: AdminUserDTO = {
        id: user.id.toString(),
        name: user.name.value,
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        isAdminUser: user.isAdminUser,
        isDeleted: user.isDeleted,
        isRegistrationComplete: user.isRegistrationComplete,
        createdAt: raw?.created_at ?? '',
        updatedAt: raw?.updated_at ?? '',
      };

      return right(Result.ok(dto));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
