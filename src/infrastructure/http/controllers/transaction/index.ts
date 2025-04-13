import { createController } from "./create";
import { deleteController } from "./delete";
import { getAllController } from "./getAll";
import { getByIdController } from "./getById";
import { updateController } from "./update";

const transactionController = {
    create:createController,
    getAll:getAllController,
    get:getByIdController,
    delete:deleteController,
    update:updateController,
}

export default transactionController;