import { RequestPasswordResetUseCase } from './RequestPasswordResetUseCase';
import { RequestPasswordResetController } from './RequestPasswordResetController';
import { userRepo } from '../../repos/implementation';
import { passwordResetService } from '../../../../shared/infrastructure/services';

const requestPasswordResetUseCase = new RequestPasswordResetUseCase(userRepo, passwordResetService);
const requestPasswordResetController = new RequestPasswordResetController(requestPasswordResetUseCase);

export { requestPasswordResetController };
