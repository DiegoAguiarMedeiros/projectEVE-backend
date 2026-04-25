import { DeleteUseCase } from '../DeleteUseCase';
import { DeleteErrors } from '../DeleteErrors';
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

describe('DeleteCreditCardUseCase', () => {
  let useCase: DeleteUseCase;
  let repo: jest.Mocked<ICreditCardRepo>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new DeleteUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando cartão não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute({ id: 'cc-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteErrors.NotFound);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getById.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ id: 'cc-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });

    it('não deve chamar repo.delete quando cartão não é encontrado', async () => {
      repo.getById.mockResolvedValue(null);
      await useCase.execute({ id: 'cc-uuid', userId: 'user-uuid' });
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('deve deletar cartão com sucesso', async () => {
      repo.getById.mockResolvedValue(makeCC());
      repo.delete.mockResolvedValue(true);
      const result = await useCase.execute({ id: 'cc-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(repo.delete).toHaveBeenCalledWith('cc-uuid');
    });
  });
});
