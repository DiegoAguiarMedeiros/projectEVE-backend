
import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllController } from "./GetAllController";
import { envelopeRepo } from "../../../repos";

const getAllEnvelopesUseCase = new GetAllUseCase(envelopeRepo);
const getAllEnvelopesController = new GetAllController(getAllEnvelopesUseCase);

export { getAllEnvelopesController, getAllEnvelopesUseCase }