import { UseCase } from "../../../../shared/core/UseCase";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { Interface as ITransactionsRepo } from "../../repos/Interface";
import { DeleteUseCase } from "../delete/DeleteUseCase";

type Request = { envelopeId: string; userId: string; year: number; month: number };
type Response = Either<AppError.UnexpectedError, Result<void>>;

export class DeleteAllByEnvelopeUseCase implements UseCase<Request, Promise<Response>> {
    private transactionsRepo: ITransactionsRepo;
    private deleteUseCase: DeleteUseCase;

    constructor(transactionsRepo: ITransactionsRepo, deleteUseCase: DeleteUseCase) {
        this.transactionsRepo = transactionsRepo;
        this.deleteUseCase = deleteUseCase;
    }

    public async execute(request: Request): Promise<Response> {
        try {
            const { envelopeId, userId, year, month } = request;

            const transactions = await this.transactionsRepo.getAllByEnvelope(userId, envelopeId, year, month);

            for (const transaction of transactions) {
                if (transaction.paymentMethod === 'envelope.transaction.payment_method.Reallocation') continue;
                await this.deleteUseCase.execute({ id: transaction.id.toString(), userId });
            }

            return right(Result.ok<void>());
        } catch (err) {
            return left(new AppError.UnexpectedError(err));
        }
    }
}
