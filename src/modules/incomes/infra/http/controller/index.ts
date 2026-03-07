import { createController } from "../../../use-cases/create";
import { deleteController } from "../../../use-cases/delete";
import { deleteAllController } from "../../../use-cases/delete-all";
import { getAllController } from "../../../use-cases/get-all";
import { getTotalController } from "../../../use-cases/get-total";
import { getByIdController } from "../../../use-cases/get-by-id";
import { updateController } from "../../../use-cases/update";

const incomeController = {
    create:createController,
    getAll:getAllController,
    getTotal:getTotalController,
    get:getByIdController,
    delete:deleteController,
    deleteAll:deleteAllController,
    update:updateController,
}

export default incomeController;