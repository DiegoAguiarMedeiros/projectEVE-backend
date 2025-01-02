
import { CreateDTO } from "./CreateDTO";
import { CreateErrors } from "./CreateErrors";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { IUserRepo } from "../../repos/userRepo";
import { IBaseEnvelopeRepo } from "../../../envelopes/repos/BaseEnvelopeRepo";
import { UseCase } from "../../../../shared/core/UseCase";
import { Email } from "../../domain/email";
import { Password } from "../../domain/password";
import { Name } from "../../domain/name";
import { User } from "../../domain/user";
import { CreateUseCase as CreateEnvelopeUseCase } from "../../../envelopes/useCases/envelopes/create/CreateUseCase";
import { Id } from "../../../../shared/domain/Id";
import e from "express";
import { Envelope } from "../../../envelopes/domain/envelope";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";

type Response = Either<
  CreateErrors.EmailAlreadyExistsError |
  CreateErrors.NameTakenError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class CreateUseCase implements UseCase<CreateDTO, Promise<Response>> {
  private repo: IUserRepo;
  private baseEnvelopeRepo: IBaseEnvelopeRepo;
  private createEnvelopeUseCase: CreateEnvelopeUseCase;

  constructor(repo: IUserRepo, baseEnvelopeRepo: IBaseEnvelopeRepo, createEnvelopeUseCase: CreateEnvelopeUseCase) {
    this.repo = repo;
    this.baseEnvelopeRepo = baseEnvelopeRepo;
    this.createEnvelopeUseCase = createEnvelopeUseCase;
  }

  async execute(request: CreateDTO): Promise<Response> {
    const idOrError = Id.create(request.id);
    const emailOrError = Email.create(request.email);
    const passwordOrError = Password.create({ value: request.password });
    const nameOrError = Name.create({ name: request.name });

    const dtoResult = Result.combine([
      emailOrError, passwordOrError, nameOrError, idOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as Response;
    }

    const id: Id = idOrError.getValue();
    const email: Email = emailOrError.getValue();
    const password: Password = passwordOrError.getValue();
    const name: Name = nameOrError.getValue();

    try {
      const userAlreadyExists = await this.repo.exists(email);

      if (userAlreadyExists) {
        return left(
          new CreateErrors.EmailAlreadyExistsError(email.value)
        ) as Response;
      }

      const userOrError: Result<User> = User.create({
        email, password, name, id
      });

      if (userOrError.isFailure) {
        return left(
          Result.fail<User>(userOrError.getErrorValue().toString())
        ) as Response;
      }

      const user: User = userOrError.getValue();


      await this.repo.save(user);

      const envelopes = await this.baseEnvelopeRepo.getAll();
      await envelopes.forEach(envelope => {

        this.createEnvelopeUseCase.execute({
          id: new UniqueEntityID(),
          name: envelope.name.value,
          userId: user.id.value,
          balance: 0,
          active: true,
          is_editable: false
        })

      });

      return right(Result.ok<void>())

    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}