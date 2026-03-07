import { createController } from "../../../use-cases/create";
import { getProcessedMonthController } from "../../../use-cases/get-processed-month";
//import { deleteController } from "../../../use-cases/delete";
import { getAllController } from "../../../use-cases/get-all";
import { getTotalController } from "../../../use-cases/get-total";
//import { getByIdController } from "../../../use-cases/get-by-id";
import { updateController } from "../../../use-cases/update";
import { processAllController } from "../../../use-cases/process-all";
import { deleteController } from "../../../use-cases/delete";
import { deleteAllController } from "../../../use-cases/delete-all";
import { deleteByMonthController } from "../../../use-cases/delete-by-month";

const processedIncomesController = {
    create:createController,
    processAll:processAllController,
    delete:deleteController,
    deleteAll:deleteAllController,
    deleteByMonth:deleteByMonthController,
    getProcessedMonth:getProcessedMonthController,
    getTotal:getTotalController,
    getAll:getAllController,
    //get:getByIdController,
    //delete:deleteController,
    update:updateController,
}

export default processedIncomesController;