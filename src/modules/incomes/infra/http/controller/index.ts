import { createController } from "../../../use-cases/create";
import { deleteController } from "../../../use-cases/delete";
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
    update:updateController,
}

export default incomeController;