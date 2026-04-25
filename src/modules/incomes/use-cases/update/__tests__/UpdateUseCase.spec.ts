import { UpdateUseCase } from '../UpdateUseCase';
import { UpdateErrors } from '../UpdateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IIncomesRepo } from '../../../repos/Interface';
import { IncomesMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<IIncomesRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getTotal: jest.fn(),
  deleteAll: jest.fn(),
});

const makeIncome = () => IncomesMap.toDomain({
  id: 'income-uuid',
  user_id: 'user-uuid',
  description: 'Salário mensal',
  amount: 5000,
  payment_day: 5,
});

const makeRequest = (overrides = {}) => ({
  request: { id: 'income-uuid', userId: 'user-uuid' },
  fieldUpdate: { description: 'Salário atualizado', amount: 6000, paymentDay: 10 },
  ...overrides,
});

describe('UpdateUseCase', () => {
  let useCase: UpdateUseCase;
  let repo: jest.Mocked<IIncomesRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new UpdateUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando income não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.NotFound);
    });

    it('deve retornar UpdateError quando repo.update retorna false', async () => {
      repo.getById.mockResolvedValue(makeIncome());
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

    it('deve retornar falha quando novo paymentDay é inválido', async () => {
      repo.getById.mockResolvedValue(makeIncome());
      const result = await useCase.execute(makeRequest({
        fieldUpdate: { description: 'Teste', amount: 1000, paymentDay: 99 },
      }));
      expect(result.isLeft()).toBe(true);
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('deve atualizar income com sucesso', async () => {
      repo.getById.mockResolvedValue(makeIncome());
      repo.update.mockResolvedValue(true);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(repo.update).toHaveBeenCalledTimes(1);
    });

    it('deve chamar repo.update com o income modificado', async () => {
      repo.getById.mockResolvedValue(makeIncome());
      repo.update.mockResolvedValue(true);
      await useCase.execute(makeRequest());
      const [id, updatedIncome] = repo.update.mock.calls[0];
      expect(id).toBe('income-uuid');
      expect(updatedIncome.description.value).toBe('Salário atualizado');
      expect(updatedIncome.amount.value).toBe(6000);
    });

    it('deve manter valores originais para campos não fornecidos no fieldUpdate', async () => {
      repo.getById.mockResolvedValue(makeIncome());
      repo.update.mockResolvedValue(true);
      await useCase.execute({
        request: { id: 'income-uuid', userId: 'user-uuid' },
        fieldUpdate: { description: 'Novo nome', amount: 0, paymentDay: 0 },
      });
      const [, updatedIncome] = repo.update.mock.calls[0];
      // amount e paymentDay são 0 (falsy), então mantém os originais
      expect(updatedIncome.amount.value).toBe(5000);
      expect(updatedIncome.paymentDay.value).toBe(5);
    });
  });
});
