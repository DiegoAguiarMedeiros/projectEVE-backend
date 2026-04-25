import { UpdateUseCase } from '../UpdateUseCase';
import { UpdateErrors } from '../UpdateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as ICreditCardRepo } from '../../../repos/Interface';
import { CreditCardMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<ICreditCardRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  checkName: jest.fn(),
  deleteAll: jest.fn(),
});

const makeCC = () => CreditCardMap.toDomain({
  id: 'cc-uuid',
  name: 'Nubank',
  flag: 'Visa',
  active: true,
  user_id: 'user-uuid',
});

const makeRequest = (overrides = {}) => ({
  request: { id: 'cc-uuid', userId: 'user-uuid' },
  fieldUpdate: { name: 'Itaú', flag: 'Mastercard' as const, active: true },
  ...overrides,
});

describe('UpdateCreditCardUseCase', () => {
  let useCase: UpdateUseCase;
  let repo: jest.Mocked<ICreditCardRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new UpdateUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando cartão não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.NotFound);
    });

    it('deve retornar AlreadyExist quando novo nome já está em uso', async () => {
      repo.getById.mockResolvedValue(makeCC());
      repo.checkName.mockResolvedValue(true);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.AlreadyExist);
    });

    it('deve retornar UpdateError quando repo.update retorna false', async () => {
      repo.getById.mockResolvedValue(makeCC());
      repo.checkName.mockResolvedValue(false);
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

    it('deve retornar falha quando flag é inválida', async () => {
      repo.getById.mockResolvedValue(makeCC());
      const result = await useCase.execute(makeRequest({
        fieldUpdate: { name: 'Itaú', flag: 'BandeiraInvalida' as any, active: true },
      }));
      expect(result.isLeft()).toBe(true);
      expect(repo.checkName).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('deve atualizar cartão com sucesso', async () => {
      repo.getById.mockResolvedValue(makeCC());
      repo.checkName.mockResolvedValue(false);
      repo.update.mockResolvedValue(true);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(repo.update).toHaveBeenCalledTimes(1);
    });

    it('deve atualizar nome e flag corretamente', async () => {
      repo.getById.mockResolvedValue(makeCC());
      repo.checkName.mockResolvedValue(false);
      repo.update.mockResolvedValue(true);
      await useCase.execute(makeRequest());
      const [, updated] = repo.update.mock.calls[0];
      expect(updated.name.value).toBe('Itaú');
      expect(updated.flag.value).toBe('Mastercard');
    });
  });
});
