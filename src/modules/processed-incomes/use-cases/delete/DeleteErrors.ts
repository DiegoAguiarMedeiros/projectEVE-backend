import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace DeleteErrors {

  export class NotFound extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `Processed income with id ${id} not found`
      } as UseCaseError);
    }
  }

}
