import { GetStatsByMonthUseCase } from './GetStatsByMonthUseCase';
import { GetStatsByMonthController } from './GetStatsByMonthController';

const getStatsByMonthUseCase = new GetStatsByMonthUseCase();
const getStatsByMonthController = new GetStatsByMonthController(getStatsByMonthUseCase);

export { getStatsByMonthController };
