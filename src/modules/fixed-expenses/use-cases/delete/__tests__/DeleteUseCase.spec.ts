import { DeleteUseCase } from '../DeleteUseCase';
import { DeleteErrors } from '../DeleteErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IFixedExpenseRepo } from '../../../repos/Interface';
import { FixedExpenseMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<IFixedExpenseRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
  getTotalByEnvelope: jest.fn(),
});

const makeFE = () => FixedExpenseMap.toDomain({
  id: 'fe-uuid',
  envelope_id: 'env-uuid',
  description: 'Conta de internet',
  amount: 120,
  payment_day: 10,
});

describe('DeleteFixedExpenseUseCase', () => {
  let useCase: DeleteUseCase;
  let repo: jest.Mocked<IFixedExpenseRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new DeleteUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando fixed expense não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute({ id: 'fe-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteErrors.NotFound);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getById.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ id: 'fe-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });

    it('não deve chamar repo.delete quando registro não é encontrado', async () => {
      repo.getById.mockResolvedValue(null);
      await useCase.execute({ id: 'fe-uuid', userId: 'user-uuid' });
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('deve deletar fixed expense com sucesso', async () => {
      repo.getById.mockResolvedValue(makeFE());
      repo.delete.mockResolvedValue(true);
      const result = await useCase.execute({ id: 'fe-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(repo.delete).toHaveBeenCalledWith('fe-uuid');
    });
  });
});
