
import { Interface as ICreditCardRepo } from "../../repos/Interface";
import { AppError } from "../../../../shared/core/AppError";
import { left, right, Result } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Name } from "../../../../shared/domain/Name";
import { TextUtils } from "../../../../shared/utils/TextUtils";
import { UpdateDTO } from "../../dtos";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";
import { Flag,Flags } from "../../domain";


export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: ICreditCardRepo;

    constructor(repo: ICreditCardRepo) {
        this.repo = repo;
    }
    async execute(data: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const creditCard = await this.repo.getById(data.request.id, data.request.userId);

            if (!creditCard) {
                return left(
                    new UpdateErrors.NotFound(data.request.id)
                ) as UpdateResponse;
            }

            const nameOrError = Name.create({ name: data.fieldUpdate.name ? TextUtils.sanitize(data.fieldUpdate.name) : creditCard.name.value });
            const flagOrError = Flag.create({ flag: data.fieldUpdate.flag as Flags ?? creditCard.flag.value });

            const dtoResult = Result.combine([
                nameOrError, flagOrError,
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }


            const name: Name = nameOrError.getValue();
            const flag: Flag = flagOrError.getValue();


            if (data.fieldUpdate.name) creditCard.updateName(name)
            if (data.fieldUpdate.flag) creditCard.updateFlag(flag)

            const checkname = await this.repo.checkName(name.value, data.request.userId.toString());
            if (checkname) {
                return left(
                    new UpdateErrors.AlreadyExist(name.value)
                ) as UpdateResponse;
            }

            const updateCreditCard = await this.repo.update(data.request.id.toString(), creditCard);
            if (updateCreditCard) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(data.request.id.toString())
            ) as UpdateResponse;


        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}