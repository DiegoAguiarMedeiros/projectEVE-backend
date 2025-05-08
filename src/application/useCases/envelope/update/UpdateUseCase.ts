
import { UpdateDTO } from "../../../../domain/dto/envelope";
import { Envelope } from "../../../../domain/entities/envelope/Envelope";
import { Interface as IEnvelopeRepo } from "../../../../domain/repositories/envelope/Interface";
import { AppError } from "../../../../domain/shared/core/AppError";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { Name } from "../../../../domain/shared/Name";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";



export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: IEnvelopeRepo;

    constructor(repo: IEnvelopeRepo) {
        this.repo = repo;
    }
    async execute(data: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const checkname = await this.repo.checkName(data.fieldUpdate.name, data.request.userId.toString());
            if (checkname) {
                return left(
                    new UpdateErrors.NameAlreadyExist(data.fieldUpdate.name)
                ) as UpdateResponse;
            }
            const envelope = await this.repo.getById(data.request.id.toString(), data.request.userId.toString());
            if (!envelope) {
                return left(
                    new UpdateErrors.NotFound(data.request.id.toString())
                ) as UpdateResponse;
            }


            const nameOrError = Name.create({ name: data.fieldUpdate.name });
            const dtoResult = Result.combine([
                nameOrError
            ]);
            
            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }
            const name: Name = nameOrError.getValue();
            envelope.updateName(name);

            
            if (envelope.is_editable) {
                const update = await this.repo.update(data.request.id.toString(), envelope);
                if (update) return right(Result.ok<void>()) as UpdateResponse;

                return left(
                    new UpdateErrors.UpdateError(data.request.id.toString())
                ) as UpdateResponse;
            }

            return left(
                new UpdateErrors.NameCanNotBeChanged(data.request.id.toString())
            ) as UpdateResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }     

}