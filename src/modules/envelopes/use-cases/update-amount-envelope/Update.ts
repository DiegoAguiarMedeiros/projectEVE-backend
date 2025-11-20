
import { UseCase } from "../../../../shared/core/UseCase";
import { Repository as IRepo } from "../../repos/implementation/Repository";
import { UpdateDTO } from "./UpdateDTO";
import { Repository as IEnvelopeRepo } from "../../repos/implementation/Repository";
import { Repository as ITransactionRepo } from "../../../transactions/repos/implementation/Repository";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { UpdateErrors } from "./UpdateErrors";

type Response = Either<
  UpdateErrors.UserDoesntExistError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class Update implements UseCase<UpdateDTO, Promise<Response>> {
  private envelopeRepo: IEnvelopeRepo;

  constructor(envelopeRepo: IEnvelopeRepo) {
    this.envelopeRepo = envelopeRepo;
  }

  public async execute(request: UpdateDTO): Promise<Response> {

    try {
      const { envelopeId, amount, year, month } = request;
      await this.envelopeRepo.addAmount(envelopeId, amount, year, month);

      return right(Result.ok<void>());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}