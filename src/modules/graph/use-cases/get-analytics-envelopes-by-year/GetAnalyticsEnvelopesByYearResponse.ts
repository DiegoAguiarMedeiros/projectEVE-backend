import { Pagination } from "../../../../shared/domain/Pagination";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { AnalyticsEnvelopesByYearDTO } from "../../dtos";

export type GetAnalyticsEnvelopesByYearResponse = Either<
    AppError.UnexpectedError,
    Result<AnalyticsEnvelopesByYearDTO>
>