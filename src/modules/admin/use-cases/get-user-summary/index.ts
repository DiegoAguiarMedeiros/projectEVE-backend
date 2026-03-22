import { GetUserSummaryAdminUseCase } from './GetUserSummaryAdminUseCase';
import { GetUserSummaryAdminController } from './GetUserSummaryAdminController';

const getUserSummaryAdminUseCase = new GetUserSummaryAdminUseCase();
const getUserSummaryAdminController = new GetUserSummaryAdminController(getUserSummaryAdminUseCase);

export { getUserSummaryAdminController };
