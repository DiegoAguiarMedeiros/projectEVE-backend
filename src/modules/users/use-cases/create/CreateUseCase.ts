
import { Name } from "../../../../shared/domain/Name";
import { Interface as IUserRepo } from "../../repos/Interface";
import { AppError } from "../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Id } from "../../../../shared/domain/Id";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { CreateErrors } from "./CreateErrors";
import { CreateResponse } from "./CreateResponse";
import { CreateDTO } from "../../dtos";
import { Password } from "../../domain/Password";
import { Email } from "../../domain/Email";
import { User } from "../../domain/User";


export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IUserRepo;

  constructor(repo: IUserRepo) {
    this.repo = repo;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const emailOrError = Email.create(request.email);
    const passwordOrError = Password.create({ value: request.password });
    const nameOrError = Name.create({ name: request.name });

    const dtoResult = Result.combine([
      emailOrError, passwordOrError, nameOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
    }

    const email: Email = emailOrError.getValue();
    const password: Password = passwordOrError.getValue();
    const name: Name = nameOrError.getValue();

    try {
      const userAlreadyExists = await this.repo.exists(email);

      if (userAlreadyExists) {
        return left(
          new CreateErrors.EmailAlreadyExistsError(email.value)
        ) as CreateResponse;
      }

      const userOrError: Result<User> = User.create({
        email, password, name
      });

      if (userOrError.isFailure) {
        return left(
          Result.fail<User>(userOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const user: User = userOrError.getValue();


      await this.repo.create(user);

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}