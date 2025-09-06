import { Pagination } from "../../../../shared/domain/Pagination";
import { AppError } from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { AnalyticsEnvelopesMonthOverviewDTO } from "../../dtos";

export type GetAnalyticsEnvelopesMonthOverviewResponse = Either<
    AppError.UnexpectedError,
    Result<AnalyticsEnvelopesMonthOverviewDTO[]>
>