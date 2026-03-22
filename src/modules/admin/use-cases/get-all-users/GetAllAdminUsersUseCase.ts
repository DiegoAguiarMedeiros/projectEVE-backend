import { UseCase } from '../../../../shared/core/UseCase';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { Interface as IUserRepo } from '../../../users/repos/Interface';
import { AdminUserDTO } from '../../dtos';

export interface GetAllAdminUsersRequest {
  page?: number;
  limit?: number;
  search?: string;
  isDeleted?: boolean;
  isAdmin?: boolean;
}

interface GetAllAdminUsersResponse {
  users: AdminUserDTO[];
  total: number;
  page: number;
  limit: number;
}

type Response = Either<AppError.UnexpectedError, Result<GetAllAdminUsersResponse>>;

export class GetAllAdminUsersUseCase implements UseCase<GetAllAdminUsersRequest, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(request: GetAllAdminUsersRequest): Promise<Response> {
    try {
      const page = request.page ?? 1;
      const limit = request.limit ?? 20;

      const { users, total } = await this.userRepo.findAll({
        page,
        limit,
        search: request.search,
        isDeleted: request.isDeleted,
        isAdmin: request.isAdmin,
      });

      const dtos: AdminUserDTO[] = users.map((u: any) => ({
        id: u.id.toString(),
        name: u.name.value,
        email: u.email.value,
        isEmailVerified: u.isEmailVerified,
        isAdminUser: u.isAdminUser,
        isDeleted: u.isDeleted,
        isRegistrationComplete: u.isRegistrationComplete,
        createdAt: u.props?.createdAt ?? '',
        updatedAt: u.props?.updatedAt ?? '',
      }));

      return right(Result.ok({ users: dtos, total, page, limit }));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
