import { AppError } from "../../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { TextUtils } from "../../../../../shared/utils/TextUtils";
import { Flag } from "../../../domain/flag";
import { Flags } from "../../../domain/flags";
import { Name } from "../../../domain/name";
import { ICreditCardRepo } from "../../../repos/CreditCardRepo";
import { UpdateDTO } from "./UpdateDTO";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";


export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: ICreditCardRepo;

    constructor(repo: ICreditCardRepo) {
        this.repo = repo;
    }
    async execute(request: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const creditCard = await this.repo.getById(request.id.toString(), request.userId.toString());
            if (!creditCard) {
                return left(
                    new UpdateErrors.NotFound(request.id.toString())
                ) as UpdateResponse;
            }



            const nameOrError = Name.create({ name: request.name ? TextUtils.sanitize(request.name) : creditCard.name.value });
            const flagOrError = Flag.create({ flag: request.flag as Flags ?? creditCard.flag.value });

            const dtoResult = Result.combine([
                nameOrError, flagOrError,
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }


            const name: Name = nameOrError.getValue();
            const flag: Flag = flagOrError.getValue();


            if (request.name) creditCard.updateName(name)
            if (request.flag) creditCard.updateFlag(flag)

            const checkname = await this.repo.checkName(name.value, request.userId.toString());
            if (checkname) {
                return left(
                    new UpdateErrors.AlreadyExist(name.value)
                ) as UpdateResponse;
            }

            const updateCreditCard = await this.repo.update(request.id.toString(), request.userId.toString(), creditCard);
            if (updateCreditCard) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(request.id.toString())
            ) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}