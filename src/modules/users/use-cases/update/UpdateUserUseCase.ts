
import { UseCase } from "../../../../shared/core/UseCase";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { UpdateUserDTO } from "./UpdateUserDTO";
import { Interface as IUserRepo } from "../../repos/Interface";
import { Name } from "../../../../shared/domain/Name";
import { User } from "../../domain/User";

type Response = Either<
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>;

export class UpdateUserUseCase implements UseCase<UpdateUserDTO, Promise<Response>> {
    private userRepo: IUserRepo;

    constructor(userRepo: IUserRepo) {
        this.userRepo = userRepo;
    }

    public async execute(request: UpdateUserDTO): Promise<Response> {
        try {
            const user = await this.userRepo.getUserByUserId(request.userId);

            if (request.name) {
                const nameOrError = Name.create({ name: request.name });
                if (nameOrError.isFailure) {
                    return left(Result.fail<void>(nameOrError.getErrorValue().toString())) as Response;
                }
                user.updateName(nameOrError.getValue());
            }

            await this.userRepo.save(user);

            return right(Result.ok<void>()) as Response;
        } catch (err) {
            console.log(err)
            return left(new AppError.UnexpectedError(err)) as Response;
        }
    }
}
