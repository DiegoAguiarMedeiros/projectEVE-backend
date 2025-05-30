
import { UseCase } from "../../../../../shared/core/UseCase";
import { Repository as IRepo } from "../../repos/implementation/Repository";
import { CreateDTO } from "./CreateDTO";
import { Repository as IUserRepo } from "../../../../account/user/repos/implementation/Repository";
import { Repository as IBaseEnvelopeRepo } from "../../../base-envelope/repos/implementation/Repository";
import { Either, Result, left, right } from "../../../../../shared/core/Result";
import { AppError } from "../../../../../shared/core/AppError";
import { CreateErrors } from "./CreateErrors";
import { User } from "../../../../account/user/domain/User";
import { CreateUseCase } from "../create/CreateUseCase";

type Response = Either<
  CreateErrors.UserDoesntExistError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class Create implements UseCase<CreateDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private baseEnvelopeRepo: IBaseEnvelopeRepo;
  private createEnvelopeUseCase: CreateUseCase;

  constructor(userRepo: IUserRepo, baseEnvelopeRepo: IBaseEnvelopeRepo,createEnvelopeUseCase:CreateUseCase) {
    this.userRepo = userRepo;
    this.baseEnvelopeRepo = baseEnvelopeRepo;
    this.createEnvelopeUseCase = createEnvelopeUseCase;
  }

  public async execute(request: CreateDTO): Promise<Response> {
    let user: User;
    const { userId } = request;

    try {
      try {
        user = await this.userRepo.getUserByUserId(userId);
      } catch (err) {
        return left(new CreateErrors.UserDoesntExistError(userId));
      }
      const data = await this.baseEnvelopeRepo.getAll();
      await data.forEach(item => {
        this.createEnvelopeUseCase.execute({
          name: item.name.value,
          color: item.color.value,
          percentage: 0,
          userId: user.id.toString(),
        })

      });
      return right(Result.ok<void>());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}