import { AppError } from "../../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { IEnvelopeRepo } from "../../../repos/EnvelopeRepo";
import { UpdateEnvelopeNameDTO } from "./UpdateEnvelopeNameDTO";
import { UpdateEnvelopeNameErrors } from "./UpdateEnvelopeNameErrors";

type Response = Either<
    UpdateEnvelopeNameErrors.EnvelopeUpdateError |
    UpdateEnvelopeNameErrors.EnvelopeNameCanNotBeChanged |
    UpdateEnvelopeNameErrors.EnvelopeNotFound |
    UpdateEnvelopeNameErrors.EnvelopeNameAlreadyExist |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>

export class UpdateEnvelopeNameUseCase implements UseCase<UpdateEnvelopeNameDTO, Promise<Response>> {
    private envelopeRepo: IEnvelopeRepo;

    constructor(envelopeRepo: IEnvelopeRepo) {
        this.envelopeRepo = envelopeRepo;
    }
    async execute(request: UpdateEnvelopeNameDTO): Promise<Promise<Response>> {
        try {

            const checkname = await this.envelopeRepo.checkName(request.name, request.userId.toString());
            if (checkname) {
                return left(
                    new UpdateEnvelopeNameErrors.EnvelopeNameAlreadyExist(request.name)
                ) as Response;
            }
            const envelope = await this.envelopeRepo.getById(request.id.toString(), request.userId.toString());
            if (!envelope) {
                return left(
                    new UpdateEnvelopeNameErrors.EnvelopeNotFound(request.id.toString())
                ) as Response;
            }

            if (envelope.is_editable) {
                const updateName = await this.envelopeRepo.updateName(request.id.toString(), request.userId.toString(), request.name);
                if (updateName) return right(Result.ok<void>()) as Response;

                return left(
                    new UpdateEnvelopeNameErrors.EnvelopeUpdateError(request.id.toString())
                ) as Response;
            }

            return left(
                new UpdateEnvelopeNameErrors.EnvelopeNameCanNotBeChanged(request.id.toString())
            ) as Response;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as Response;
        }
    }

}