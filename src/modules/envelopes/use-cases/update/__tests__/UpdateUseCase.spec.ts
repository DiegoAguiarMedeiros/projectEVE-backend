import { UpdateUseCase } from '../UpdateUseCase';
import { UpdateErrors } from '../UpdateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IEnvelopeRepo } from '../../../repos/Interface';
import { Interface as IFixedExpenseRepo } from '../../../../fixed-expenses/repos/Interface';
import { Interface as IIncomeRepo } from '../../../../incomes/repos/Interface';
import { EnvelopesMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<Pick<IEnvelopeRepo, 'getById' | 'update' | 'getTotalPercentage'>> => ({
  getById: jest.fn(),
  update: jest.fn(),
  getTotalPercentage: jest.fn(),
});

const makeFixedExpenseRepo = (): jest.Mocked<Pick<IFixedExpenseRepo, 'getTotalByEnvelope'>> => ({
  getTotalByEnvelope: jest.fn(),
});

const makeIncomeRepo = (): jest.Mocked<Pick<IIncomeRepo, 'getTotal'>> => ({
  getTotal: jest.fn(),
});

const makeEnvelope = (nameOverride = 'Alimentação') => EnvelopesMap.toDomain({
  id: 'env-uuid',
  name: nameOverride,
  color: '#ff5733',
  order: 1,
  percentage: 30,
  user_id: 'user-uuid',
  EnvelopesAmounts: [],
});

const makeRequest = (overrides = {}) => ({
  request: { id: 'env-uuid', userId: 'user-uuid' },
  fieldUpdate: { name: 'Alimentação', color: '#00ff00', percentage: 25 },
  ...overrides,
});

describe('UpdateEnvelopeUseCase', () => {
  let useCase: UpdateUseCase;
  let repo: jest.Mocked<any>;
  let fixedExpenseRepo: jest.Mocked<any>;
  let incomeRepo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    fixedExpenseRepo = makeFixedExpenseRepo();
    incomeRepo = makeIncomeRepo();
    fixedExpenseRepo.getTotalByEnvelope.mockResolvedValue(0);
    useCase = new UpdateUseCase(repo as any, fixedExpenseRepo as any, incomeRepo as any);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando envelope não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.NotFound);
    });

    it('deve retornar falha quando color é inválida', async () => {
      repo.getById.mockResolvedValue(makeEnvelope());
      const result = await useCase.execute(makeRequest({ fieldUpdate: { color: '#fff', percentage: 25 } }));
      expect(result.isLeft()).toBe(true);
      expect(repo.update).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando percentage é inválida (> 100)', async () => {
      repo.getById.mockResolvedValue(makeEnvelope());
      const result = await useCase.execute(makeRequest({ fieldUpdate: { color: '#00ff00', percentage: 150 } }));
      expect(result.isLeft()).toBe(true);
      expect(repo.update).not.toHaveBeenCalled();
    });

    it('deve retornar ExceedsTotalPercentageError quando soma ultrapassa 100', async () => {
      repo.getById.mockResolvedValue(makeEnvelope());
      repo.getTotalPercentage.mockResolvedValue(80);
      const result = await useCase.execute(makeRequest({ fieldUpdate: { color: '#00ff00', percentage: 30 } }));
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.ExceedsTotalPercentageError);
    });

    it('deve retornar UpdateError quando repo.update retorna false', async () => {
      repo.getById.mockResolvedValue(makeEnvelope());
      repo.getTotalPercentage.mockResolvedValue(50);
      repo.update.mockResolvedValue(false);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.UpdateError);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getById.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve atualizar envelope com sucesso', async () => {
      repo.getById.mockResolvedValue(makeEnvelope());
      repo.getTotalPercentage.mockResolvedValue(50);
      repo.update.mockResolvedValue(true);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(repo.update).toHaveBeenCalledTimes(1);
    });

    it('deve pular verificação de percentagem total para envelope "debts"', async () => {
      repo.getById.mockResolvedValue(makeEnvelope('debts'));
      repo.update.mockResolvedValue(true);
      const result = await useCase.execute(makeRequest({ fieldUpdate: { color: '#00ff00', percentage: 99 } }));
      expect(result.isRight()).toBe(true);
      expect(repo.getTotalPercentage).not.toHaveBeenCalled();
    });
  });
});
