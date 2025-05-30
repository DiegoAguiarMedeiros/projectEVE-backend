import { createController } from "../../../use-cases/create";
import { deleteController } from "../../../use-cases/delete";
import { getAllController } from "../../../use-cases/get-all";
import { getByIdController } from "../../../use-cases/get-by-id";
import { updateController } from "../../../use-cases/update";

const debtController = {
    create:createController,
    getAll:getAllController,
    get:getByIdController,
    delete:deleteController,
    update:updateController,
}

export default debtController;