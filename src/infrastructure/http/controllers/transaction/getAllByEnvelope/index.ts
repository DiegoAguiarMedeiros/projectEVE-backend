import { GetAllByEnvelopeUseCase } from "../../../../../application/useCases/transaction/getAllByEnvelope/GetAllByEnvelopeUseCase";
import { transactionRepo } from "../../../../../domain/repositories";
import { GetAllByEnvelopeController } from "./GetAllByEnvelopeController";

const getAllByEnvelopeUseCase = new GetAllByEnvelopeUseCase(transactionRepo);
const getAllByEnvelopeController = new GetAllByEnvelopeController(getAllByEnvelopeUseCase);

export { getAllByEnvelopeController }