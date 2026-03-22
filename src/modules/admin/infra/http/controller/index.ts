import { getAllAdminUsersController } from '../../../use-cases/get-all-users';
import { getAdminUserByIdController } from '../../../use-cases/get-user-by-id';
import { updateAdminUserController } from '../../../use-cases/update-user';
import { deleteAdminUserController } from '../../../use-cases/delete-user';
import { getAdminStatsController } from '../../../use-cases/get-stats';
import { getStatsByMonthController } from '../../../use-cases/get-stats-by-month';
import { getAllBaseEnvelopesAdminController } from '../../../use-cases/get-all-base-envelopes';
import { createBaseEnvelopeAdminController } from '../../../use-cases/create-base-envelope';
import { updateBaseEnvelopeAdminController } from '../../../use-cases/update-base-envelope';
import { deleteBaseEnvelopeAdminController } from '../../../use-cases/delete-base-envelope';
import { getUserEnvelopesAdminController } from '../../../use-cases/get-user-envelopes';
import { getUserSummaryAdminController } from '../../../use-cases/get-user-summary';

const adminController = {
  getAllUsers: getAllAdminUsersController,
  getUserById: getAdminUserByIdController,
  updateUser: updateAdminUserController,
  deleteUser: deleteAdminUserController,
  getStats: getAdminStatsController,
  getStatsByMonth: getStatsByMonthController,
  getAllBaseEnvelopes: getAllBaseEnvelopesAdminController,
  createBaseEnvelope: createBaseEnvelopeAdminController,
  updateBaseEnvelope: updateBaseEnvelopeAdminController,
  deleteBaseEnvelope: deleteBaseEnvelopeAdminController,
  getUserEnvelopes: getUserEnvelopesAdminController,
  getUserSummary: getUserSummaryAdminController,
};

export default adminController;
