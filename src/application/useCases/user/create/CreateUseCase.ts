
import { Email } from "../../../../domain/entities/user/Email";
import { Name } from "../../../../domain/shared/Name";
import { User } from "../../../../domain/entities/user/User";
import { Interface as IBaseEnvelopeRepo } from "../../../../domain/repositories/baseEnvelope/Interface";
import { Interface as IUserRepo } from "../../../../domain/repositories/user/Interface";
import { AppError } from "../../../../domain/shared/core/AppError";
import { Either, left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { Id } from "../../../../domain/shared/Id";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";
import { CreateDTO } from "./CreateDTO";
import { CreateErrors } from "./CreateErrors";
import { CreateUseCase as CreateEnvelopeUseCase } from "../../envelope/create/CreateUseCase";
import { CreateResponse } from "./CreateResponse";
import { Password } from "../../../../domain/entities/user/Password";


export class CreateUseCase implements UseCase<CreateDTO, Promise<CreateResponse>> {
  private repo: IUserRepo;
  private baseEnvelopeRepo: IBaseEnvelopeRepo;
  private createEnvelopeUseCase: CreateEnvelopeUseCase;

  constructor(repo: IUserRepo, baseEnvelopeRepo: IBaseEnvelopeRepo, createEnvelopeUseCase: CreateEnvelopeUseCase) {
    this.repo = repo;
    this.baseEnvelopeRepo = baseEnvelopeRepo;
    this.createEnvelopeUseCase = createEnvelopeUseCase;
  }

  async execute(request: CreateDTO): Promise<CreateResponse> {
    const idOrError = Id.create(request.id);
    const emailOrError = Email.create(request.email);
    const passwordOrError = Password.create({ value: request.password });
    const nameOrError = Name.create({ name: request.name });

    const dtoResult = Result.combine([
      emailOrError, passwordOrError, nameOrError, idOrError
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateResponse;
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
        ) as CreateResponse;
      }

      const userOrError: Result<User> = User.create({
        email, password, name, id
      });

      if (userOrError.isFailure) {
        return left(
          Result.fail<User>(userOrError.getErrorValue().toString())
        ) as CreateResponse;
      }

      const user: User = userOrError.getValue();


      await this.repo.create(user);

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
      return left(new AppError.UnexpectedError(err)) as CreateResponse;
    }
  }
}