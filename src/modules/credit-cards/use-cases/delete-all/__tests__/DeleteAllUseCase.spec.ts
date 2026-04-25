import { DeleteAllUseCase } from '../DeleteAllUseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as ICreditCardRepo } from '../../../repos/Interface';

const makeRepo = (): jest.Mocked<ICreditCardRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  checkName: jest.fn(),
  deleteAll: jest.fn(),
});

describe('DeleteAllCreditCardsUseCase', () => {
  let useCase: DeleteAllUseCase;
  let repo: jest.Mocked<ICreditCardRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new DeleteAllUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.deleteAll.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ ids: ['cc-uuid'], userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar todos os cartões com sucesso', async () => {
      repo.deleteAll.mockResolvedValue(2);
      const result = await useCase.execute({ ids: ['id-1', 'id-2'], userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(repo.deleteAll).toHaveBeenCalledWith(['id-1', 'id-2'], 'user-uuid');
    });
  });
});
