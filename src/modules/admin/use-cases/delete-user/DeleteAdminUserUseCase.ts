import { UseCase } from '../../../../shared/core/UseCase';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { Interface as IUserRepo } from '../../../users/repos/Interface';

interface DeleteAdminUserRequest {
  userId: string;
}

type Response = Either<AppError.UnexpectedError, Result<void>>;

export class DeleteAdminUserUseCase implements UseCase<DeleteAdminUserRequest, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(request: DeleteAdminUserRequest): Promise<Response> {
    try {
      await this.userRepo.delete(request.userId);
      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
