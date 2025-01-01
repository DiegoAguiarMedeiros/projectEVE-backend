
import { CreateUserDTO } from "./CreateUserDTO";
import { CreateUserErrors } from "./CreateUserErrors";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { IUserRepo } from "../../repos/userRepo";
import { IBaseEnvelopeRepo } from "../../../envelopes/repos/BaseEnvelopeRepo";
import { UseCase } from "../../../../shared/core/UseCase";
import { Email } from "../../domain/email";
import { Password } from "../../domain/password";
import { Name } from "../../domain/name";
import { User } from "../../domain/user";
import { CreateEnvelopeUseCase } from "../../../envelopes/useCases/createEnvelope/CreateEnvelopeUseCase";
import { Id } from "../../../../shared/domain/Id";
import e from "express";
import { Envelope } from "../../../envelopes/domain/envelope";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";

type Response = Either<
  CreateUserErrors.EmailAlreadyExistsError |
  CreateUserErrors.NameTakenError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class CreateUserUseCase implements UseCase<CreateUserDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private baseEnvelopeRepo: IBaseEnvelopeRepo;
  private createEnvelopeUseCase: CreateEnvelopeUseCase;

  constructor(userRepo: IUserRepo, baseEnvelopeRepo: IBaseEnvelopeRepo, createEnvelopeUseCase: CreateEnvelopeUseCase) {
    this.userRepo = userRepo;
    this.baseEnvelopeRepo = baseEnvelopeRepo;
    this.createEnvelopeUseCase = createEnvelopeUseCase;
  }

  async execute(request: CreateUserDTO): Promise<Response> {
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
      const userAlreadyExists = await this.userRepo.exists(email);

      if (userAlreadyExists) {
        return left(
          new CreateUserErrors.EmailAlreadyExistsError(email.value)
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


      await this.userRepo.save(user);

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