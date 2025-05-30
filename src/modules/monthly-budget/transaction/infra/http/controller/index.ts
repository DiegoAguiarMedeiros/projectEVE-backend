import { createController } from "../../../use-cases/create";
import { deleteController } from "../../../use-cases/delete";
import { getAllController } from "../../../use-cases/get-all";
import { getAllByEnvelopeController } from "../../../use-cases/get-all-by-envelope";
import { getByIdController } from "../../../use-cases/get-by-id";
import { updateController } from "../../../use-cases/update";
import { updateStatusController } from "../../../use-cases/update-status";

const transactionController = {
    create:createController,
    getAll:getAllController,
    getAllByEnvelope:getAllByEnvelopeController,
    get:getByIdController,
    delete:deleteController,
    update:updateController,
    updateStatus:updateStatusController,
}

export default transactionController;