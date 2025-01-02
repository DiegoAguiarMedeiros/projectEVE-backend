import { AppError } from "../../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { Flag } from "../../../domain/flag";
import { Flags } from "../../../domain/flags";
import { Name } from "../../../domain/name";
import { ICreditCardRepo } from "../../../repos/CreditCardRepo";
import { UpdateDTO } from "./UpdateDTO";
import { UpdateErrors } from "./UpdateErrors";

type Response = Either<
    UpdateErrors.UpdateError |
    UpdateErrors.CanNotBeChanged |
    UpdateErrors.NotFound |
    UpdateErrors.AlreadyExist |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>

export class UpdateUseCase implements UseCase<UpdateDTO, Promise<Response>> {
    private repo: ICreditCardRepo;

    constructor(repo: ICreditCardRepo) {
        this.repo = repo;
    }
    async execute(request: UpdateDTO): Promise<Promise<Response>> {
        try {

            const nameOrError = Name.create({ name: request.name });
            const flagOrError = Flag.create({ flag: request.flag as Flags });

            const dtoResult = Result.combine([
                nameOrError, flagOrError,
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as Response;
            }


            const name: Name = nameOrError.getValue();
            const flag: Flag = flagOrError.getValue();


            const checkname = await this.repo.checkName(name.value, request.userId.toString());
            if (checkname) {
                return left(
                    new UpdateErrors.AlreadyExist(name.value)
                ) as Response;
            }
            const creditCard = await this.repo.getById(request.id.toString(), request.userId.toString());
            if (!creditCard) {
                return left(
                    new UpdateErrors.NotFound(request.id.toString())
                ) as Response;
            }


            const updateCreditCard = await this.repo.update(request.id.toString(), request.userId.toString(), name.value, flag.value);
            if (updateCreditCard) return right(Result.ok<void>()) as Response;

            return left(
                new UpdateErrors.UpdateError(request.id.toString())
            ) as Response;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as Response;
        }
    }

}