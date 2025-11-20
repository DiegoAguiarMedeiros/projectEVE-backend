import { createController } from "../../../use-cases/create";
import { getProcessedMonthController } from "../../../use-cases/get-processed-month";
//import { deleteController } from "../../../use-cases/delete";
import { getAllController } from "../../../use-cases/get-all";
import { getTotalController } from "../../../use-cases/get-total";
//import { getByIdController } from "../../../use-cases/get-by-id";
import { updateController } from "../../../use-cases/update";

const processedIncomesController = {
    create:createController,
    getProcessedMonth:getProcessedMonthController,
    getTotal:getTotalController,
    getAll:getAllController,
    //get:getByIdController,
    //delete:deleteController,
    update:updateController,
}

export default processedIncomesController;