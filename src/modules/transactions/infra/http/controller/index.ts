import { createController } from "../../../use-cases/create";
import { deleteController } from "../../../use-cases/delete";
import { deleteAllByEnvelopeController } from "../../../use-cases/delete-all-by-envelope";
import { getAllController } from "../../../use-cases/get-all";
import { getAllByEnvelopeController } from "../../../use-cases/get-all-by-envelope";
import { getByIdController } from "../../../use-cases/get-by-id";
import { getUpcomingPendingTransactionController } from "../../../use-cases/get-upcoming-pending-transactions";
import { updateController } from "../../../use-cases/update";
import { updateStatusController } from "../../../use-cases/update-status";

const transactionController = {
    create:createController,
    getAll:getAllController,
    getAllByEnvelope:getAllByEnvelopeController,
    get:getByIdController,
    delete:deleteController,
    deleteAllByEnvelope:deleteAllByEnvelopeController,
    update:updateController,
    updateStatus:updateStatusController,
    getUpcomingPendingTransaction:getUpcomingPendingTransactionController
}

export default transactionController;