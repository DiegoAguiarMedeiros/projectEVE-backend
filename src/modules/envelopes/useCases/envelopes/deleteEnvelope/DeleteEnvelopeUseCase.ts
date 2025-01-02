import { AppError } from "../../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../../shared/core/Result";
import { UseCase } from "../../../../../shared/core/UseCase";
import { IEnvelopeRepo } from "../../../repos/EnvelopeRepo";
import { DeleteEnvelopeDTO } from "./DeleteEnvelopeDTO";
import { DeleteEnvelopeErrors } from "./DeleteEnvelopeErrors";

type Response = Either<
    DeleteEnvelopeErrors.EnvelopeCanNotBeDeleted |
    DeleteEnvelopeErrors.EnvelopeNotFound |
    AppError.UnexpectedError |
    Result<any>,
    Result<void>
>


export class DeleteEnvelopeUseCase implements UseCase<DeleteEnvelopeDTO, Promise<Response>> {
    private envelopeRepo: IEnvelopeRepo;

    constructor(envelopeRepo: IEnvelopeRepo) {
        this.envelopeRepo = envelopeRepo;
    }
    async execute(request: DeleteEnvelopeDTO): Promise<Response> {

        try {

            const envelope = await this.envelopeRepo.getById(request.id.toString(), request.userId.toString());

            if (!envelope) {
                return left(
                    new DeleteEnvelopeErrors.EnvelopeNotFound(request.id.toString())
                ) as Response;
            }

            if (envelope.is_editable) {
                await this.envelopeRepo.delete(envelope.id.value);
                return right(Result.ok<void>()) as Response;
            }

            return left(
                new DeleteEnvelopeErrors.EnvelopeCanNotBeDeleted(request.id.toString())
            ) as Response;

        } catch (err) {
            return left(new AppError.UnexpectedError(err)) as Response;
        }
    }

}