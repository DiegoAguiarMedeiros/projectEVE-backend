
import { request } from "http";
import { UpdateDTO } from "../../dtos";
import { Percentage } from "../../../../shared/domain/Percentage";
import { Interface as IEnvelopeRepo } from "../../repos/Interface";
import { Color } from "../../../../shared/domain/Color";
import { AppError } from "../../../../shared/core/AppError";
import { left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { Name } from "../../../../shared/domain/Name";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";



export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: IEnvelopeRepo;

    constructor(repo: IEnvelopeRepo) {
        this.repo = repo;
    }
    async execute(data: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const envelope = await this.repo.getById(data.request.id.toString(), data.request.userId.toString());
            if (!envelope) {
                return left(
                    new UpdateErrors.NotFound(data.request.id.toString())
                ) as UpdateResponse;
            }


            const checkname = await this.repo.checkName(data.fieldUpdate.name, data.request.userId.toString());

            if (checkname && envelope.name.value !== data.fieldUpdate.name) {
                return left(
                    new UpdateErrors.NameAlreadyExist(data.fieldUpdate.name)
                ) as UpdateResponse;
            }


            const nameOrError = Name.create({ name: data.fieldUpdate.name });
            const colorOrError = Color.create({ color: data.fieldUpdate.color });
            const percentageOrError = Percentage.create({ percentage: data.fieldUpdate.percentage });



            const dtoResult = Result.combine([
                nameOrError, colorOrError, percentageOrError
            ]);

            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }
            const name: Name = nameOrError.getValue();
            const color: Color = colorOrError.getValue();
            const percentage: Percentage = percentageOrError.getValue();


            envelope.updateName(name);
            envelope.updateColor(color);
            if (envelope.name.value !== 'debts') envelope.updatePercentage(percentage);


            const update = await this.repo.update(data.request.id.toString(), envelope);
            if (update) return right(Result.ok<void>()) as UpdateResponse;

            return left(
                new UpdateErrors.UpdateError(data.request.id.toString())
            ) as UpdateResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }

}