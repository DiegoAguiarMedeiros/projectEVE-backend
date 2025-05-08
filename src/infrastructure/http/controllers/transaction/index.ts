import { createController } from "./create";
import { deleteController } from "./delete";
import { getAllController } from "./getAll";
import { getAllByEnvelopeController } from "./getAllByEnvelope";
import { getByIdController } from "./getById";
import { updateController } from "./update";
import { updateStatusController } from "./updateStatus";

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