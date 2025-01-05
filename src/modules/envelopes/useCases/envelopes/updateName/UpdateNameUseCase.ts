import { AppError } from "../../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { IEnvelopeRepo } from "../../../repos/EnvelopeRepo";
import { UpdateNameDTO } from "./UpdateNameDTO";
import { UpdateNameErrors } from "./UpdateNameErrors";
import { UpdateNameResponse } from "./UpdateNameResponse";



export class UpdateNameUseCase implements UseCase<UpdateNameDTO, Promise<UpdateNameResponse>> {
    private repo: IEnvelopeRepo;

    constructor(repo: IEnvelopeRepo) {
        this.repo = repo;
    }
    async execute(request: UpdateNameDTO): Promise<Promise<UpdateNameResponse>> {
        try {

            const checkname = await this.repo.checkName(request.name, request.userId.toString());
            if (checkname) {
                return left(
                    new UpdateNameErrors.NameAlreadyExist(request.name)
                ) as UpdateNameResponse;
            }
            const envelope = await this.repo.getById(request.id.toString(), request.userId.toString());
            if (!envelope) {
                return left(
                    new UpdateNameErrors.NotFound(request.id.toString())
                ) as UpdateNameResponse;
            }

            if (envelope.is_editable) {
                const updateName = await this.repo.updateName(request.id.toString(), request.userId.toString(), request.name);
                if (updateName) return right(Result.ok<void>()) as UpdateNameResponse;

                return left(
                    new UpdateNameErrors.UpdateError(request.id.toString())
                ) as UpdateNameResponse;
            }

            return left(
                new UpdateNameErrors.NameCanNotBeChanged(request.id.toString())
            ) as UpdateNameResponse;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as UpdateNameResponse;
        }
    }

}