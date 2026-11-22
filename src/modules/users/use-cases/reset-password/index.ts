import { ResetPasswordUseCase } from './ResetPasswordUseCase';
import { ResetPasswordController } from './ResetPasswordController';
import { userRepo } from '../../repos/implementation';
import { authService, passwordResetService } from '../../../../shared/infrastructure/services';

const resetPasswordUseCase = new ResetPasswordUseCase(userRepo, passwordResetService, authService);
const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);

export { resetPasswordController };
