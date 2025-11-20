
import { UseCase } from "../../../../shared/core/UseCase";
import { Repository as IRepo } from "../../repos/implementation/Repository";
import { CreateDTO } from "./CreateDTO";
import { Repository as IEnvelopeRepo } from "../../repos/implementation/Repository";
import { Repository as ITransactionRepo } from "../../../transactions/repos/implementation/Repository";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { AppError } from "../../../../shared/core/AppError";
import { CreateErrors } from "./CreateErrors";

type Response = Either<
  CreateErrors.UserDoesntExistError |
  AppError.UnexpectedError |
  Result<any>,
  Result<void>
>

export class Create implements UseCase<CreateDTO, Promise<Response>> {
  private envelopeRepo: IEnvelopeRepo;

  constructor(envelopeRepo: IEnvelopeRepo) {
    this.envelopeRepo = envelopeRepo;
  }

  public async execute(request: CreateDTO): Promise<Response> {

    try {
      const { envelopeId, amount, year, month } = request;
      await this.envelopeRepo.createAmount(envelopeId, amount, year, month);
      return right(Result.ok<void>());

    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}