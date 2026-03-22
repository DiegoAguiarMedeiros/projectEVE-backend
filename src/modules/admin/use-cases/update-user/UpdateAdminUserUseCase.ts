import { UseCase } from '../../../../shared/core/UseCase';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { UpdateAdminUserDTO } from '../../dtos';
import models from '../../../../shared/infrastructure/database/sequelize/models';

type Response = Either<AppError.UnexpectedError, Result<void>>;

export class UpdateAdminUserUseCase implements UseCase<UpdateAdminUserDTO, Promise<Response>> {
  public async execute(request: UpdateAdminUserDTO): Promise<Response> {
    try {
      const updateData: any = {};

      if (request.isDeleted !== undefined) updateData.is_deleted = request.isDeleted;
      if (request.isAdminUser !== undefined) updateData.is_admin_user = request.isAdminUser;
      if (request.isEmailVerified !== undefined) updateData.is_email_verified = request.isEmailVerified;

      await models.Users.update(updateData, { where: { id: request.userId } });

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
