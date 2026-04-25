import { ResetPasswordUseCase } from './ResetPasswordUseCase';
import { ResetPasswordController } from './ResetPasswordController';
import { userRepo } from '../../repos/implementation';
import { passwordResetService } from '../../../../shared/infrastructure/services';

const resetPasswordUseCase = new ResetPasswordUseCase(userRepo, passwordResetService);
const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);

export { resetPasswordController };
