
import { GetAllEnvelopesUseCase } from "./GetAllEnvelopesUseCase";
import { GetAllEnvelopesController } from "./GetAllEnvelopesController";
import { envelopeRepo } from "../../repos";

const getAllEnvelopesUseCase = new GetAllEnvelopesUseCase(envelopeRepo);
const getAllEnvelopesController = new GetAllEnvelopesController(getAllEnvelopesUseCase);

export { getAllEnvelopesController, getAllEnvelopesUseCase }