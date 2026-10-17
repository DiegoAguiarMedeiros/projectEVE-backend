import { createController } from "../../../use-cases/create";
import { deleteController } from "../../../use-cases/delete";
import { deleteAllController } from "../../../use-cases/delete-all";
import { getAllController } from "../../../use-cases/get-all";
import { getByIdController } from "../../../use-cases/get-by-id";
import { updateController } from "../../../use-cases/update";
import { DebtSummaryController } from "../../../use-cases/get-summary/DebtSummaryController";

const debtsController = {
    create: createController,
    getAll: getAllController,
    get: getByIdController,
    delete: deleteController,
    deleteAll: deleteAllController,
    update: updateController,
    summary: new DebtSummaryController(),
}

export default debtsController;