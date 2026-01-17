import { createController } from "../../../use-cases/create";
import { deleteController } from "../../../use-cases/delete";
import { getAllController } from "../../../use-cases/get-all";
import { getAllController as getAllMonthlyController } from "../../../use-cases/get-all-monthly";
import { getByIdController } from "../../../use-cases/get-by-id";
import { updateController } from "../../../use-cases/update";
import { transferEnvelopeBalanceController } from "../../../use-cases/transfer-balance";

const envelopeController = {
    create: createController,
    getAll: getAllController,
    getAllMonthly: getAllMonthlyController,
    get: getByIdController,
    delete: deleteController,
    update: updateController,
    transfer: transferEnvelopeBalanceController
}

export default envelopeController;