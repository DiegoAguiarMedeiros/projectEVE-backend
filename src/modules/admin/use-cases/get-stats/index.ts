import { GetAdminStatsUseCase } from './GetAdminStatsUseCase';
import { GetAdminStatsController } from './GetAdminStatsController';

const getAdminStatsUseCase = new GetAdminStatsUseCase();
const getAdminStatsController = new GetAdminStatsController(getAdminStatsUseCase);

export { getAdminStatsController };
