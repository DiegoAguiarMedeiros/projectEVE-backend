
import { transactionRepo } from "../../repos/implementation";
import { GetAllByEnvelopeController } from "./GetAllByEnvelopeController";
import { GetAllByEnvelopeUseCase } from "./GetAllByEnvelopeUseCase";

const getAllByEnvelopeUseCase = new GetAllByEnvelopeUseCase(transactionRepo);
const getAllByEnvelopeController = new GetAllByEnvelopeController(getAllByEnvelopeUseCase);

export { getAllByEnvelopeController }