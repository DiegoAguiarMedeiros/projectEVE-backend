
import { transactionRepo } from "../../repos/implementation";
import { DeleteUseCase as DeleteTransactionUseCase } from "../delete/DeleteUseCase";
import { DeleteAll } from "./DeleteAll";

const deleteUseCase = new DeleteTransactionUseCase(transactionRepo);
const deleteAll = new DeleteAll(deleteUseCase, transactionRepo)

export { deleteAll };