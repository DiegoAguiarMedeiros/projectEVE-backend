import { CreateUseCase } from '../CreateUseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IIncomesRepo } from '../../../repos/Interface';

const makeRepo = (): jest.Mocked<IIncomesRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getTotal: jest.fn(),
  deleteAll: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  userId: 'user-uuid',
  description: 'Salário mensal',
  amount: 5000,
  paymentDay: 5,
  ...overrides,
});

describe('CreateUseCase', () => {
  let useCase: CreateUseCase;
  let repo: jest.Mocked<IIncomesRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new CreateUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar falha quando description é inválida (muito curta)', async () => {
      const result = await useCase.execute(makeRequest({ description: 'A' }));
      expect(result.isLeft()).toBe(true);
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando amount é negativo', async () => {
      const result = await useCase.execute(makeRequest({ amount: -1 }));
      expect(result.isLeft()).toBe(true);
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando paymentDay está fora do range', async () => {
      const result = await useCase.execute(makeRequest({ paymentDay: 32 }));
      expect(result.isLeft()).toBe(true);
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.create.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve criar income com sucesso e chamar repo.create uma vez', async () => {
      repo.create.mockResolvedValue(undefined);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(repo.create).toHaveBeenCalledTimes(1);
    });

    it('deve chamar repo.create com instância de Incomes', async () => {
      repo.create.mockResolvedValue(undefined);
      await useCase.execute(makeRequest());
      const [calledWith] = repo.create.mock.calls[0];
      expect(calledWith.description.value).toBe('Salário mensal');
      expect(calledWith.amount.value).toBe(5000);
      expect(calledWith.paymentDay.value).toBe(5);
    });
  });
});
