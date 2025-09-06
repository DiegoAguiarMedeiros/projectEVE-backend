import { Pagination } from "../../../../shared/domain/Pagination";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { AnalyticsCurrentEnvelopesDTO } from "../../dtos";

export type GetAnalyticsCurrentEnvelopesResponse = Either<
    AppError.UnexpectedError,
    Result<AnalyticsCurrentEnvelopesDTO>
>