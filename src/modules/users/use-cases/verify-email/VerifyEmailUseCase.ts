import { Interface as IUserRepo } from "../../repos/Interface";
import { AppError } from "../../../../shared/core/AppError";
import { Either, left, Result, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { VerifyEmailErrors } from "./VerifyEmailErrors";

type VerifyEmailDTO = { token: string };

type VerifyEmailResponse = Either<
  VerifyEmailErrors.InvalidOrExpiredTokenError | AppError.UnexpectedError,
  Result<void>
>;

export class VerifyEmailUseCase implements UseCase<VerifyEmailDTO, Promise<VerifyEmailResponse>> {
  private repo: IUserRepo;

  constructor(repo: IUserRepo) {
    this.repo = repo;
  }

  async execute(request: VerifyEmailDTO): Promise<VerifyEmailResponse> {
    try {
      const user = await this.repo.getUserByVerificationToken(request.token);

      if (!user) {
        return left(new VerifyEmailErrors.InvalidOrExpiredTokenError());
      }

      const expiresAt = user.emailVerificationTokenExpiresAt;
      if (!expiresAt || expiresAt < new Date()) {
        return left(new VerifyEmailErrors.InvalidOrExpiredTokenError());
      }

      user.verifyEmail();
      await this.repo.save(user);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
