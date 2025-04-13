
import { Envelope } from "../../../../domain/entities/envelope/Envelope";
import { Interface as IEnvelopeRepo } from "../../../../domain/repositories/envelope/Interface";
import { AppError } from "../../../../domain/shared/core/AppError";
import { left, Result, right } from "../../../../domain/shared/core/Result";
import { UseCase } from "../../../../domain/shared/core/UseCase";
import { Name } from "../../../../domain/shared/Name";
import { UpdateDTO } from "./UpdateDTO";
import { UpdateErrors } from "./UpdateErrors";
import { UpdateResponse } from "./UpdateResponse";



export class UpdateUseCase implements UseCase<UpdateDTO, Promise<UpdateResponse>> {
    private repo: IEnvelopeRepo;

    constructor(repo: IEnvelopeRepo) {
        this.repo = repo;
    }
    async execute(request: UpdateDTO): Promise<Promise<UpdateResponse>> {
        try {

            const checkname = await this.repo.checkName(request.name, request.userId.toString());
            if (checkname) {
                return left(
                    new UpdateErrors.NameAlreadyExist(request.name)
                ) as UpdateResponse;
            }
            const envelope = await this.repo.getById(request.id.toString(), request.userId.toString());
            if (!envelope) {
                return left(
                    new UpdateErrors.NotFound(request.id.toString())
                ) as UpdateResponse;
            }


            const nameOrError = Name.create({ name: request.name });
            const dtoResult = Result.combine([
                nameOrError
            ]);
            
            if (dtoResult.isFailure) {
                return left(Result.fail<void>(dtoResult.getErrorValue())) as UpdateResponse;
            }
            const name: Name = nameOrError.getValue();
            envelope.updateName(name);

            
            if (envelope.is_editable) {
                const update = await this.repo.update(request.id.toString(), request.userId.toString(), envelope);
                if (update) return right(Result.ok<void>()) as UpdateResponse;

                return left(
                    new UpdateErrors.UpdateError(request.id.toString())
                ) as UpdateResponse;
            }

            return left(
                new UpdateErrors.NameCanNotBeChanged(request.id.toString())
            ) as UpdateResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateResponse;
        }
    }     

}