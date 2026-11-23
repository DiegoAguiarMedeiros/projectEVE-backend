import { DeleteUseCase } from '../DeleteUseCase';
import { DeleteErrors } from '../DeleteErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IEnvelopeRepo } from '../../../repos/Interface';
import { EnvelopesMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<Pick<IEnvelopeRepo, 'getById' | 'delete'>> => ({
  getById: jest.fn(),
  delete: jest.fn(),
});

const makeEnvelope = (name = 'Alimentação') => EnvelopesMap.toDomain({
  id: 'env-uuid',
  name,
  color: '#ff5733',
  order: 1,
  percentage: 30,
  user_id: 'user-uuid',
  EnvelopesAmounts: [],
});

describe('DeleteEnvelopeUseCase', () => {
  let useCase: DeleteUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new DeleteUseCase(repo as any);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando envelope não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute({ id: 'env-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteErrors.NotFound);
      expect(repo.delete).not.toHaveBeenCalled();
    });

    it('deve retornar CanNotBeDeleted para o envelope debts', async () => {
      repo.getById.mockResolvedValue(makeEnvelope('debts'));
      const result = await useCase.execute({ id: 'env-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteErrors.CanNotBeDeleted);
      expect(repo.delete).not.toHaveBeenCalled();
    });

    it('deve retornar CanNotBeDeleted para o envelope goals', async () => {
      repo.getById.mockResolvedValue(makeEnvelope('goals'));
      const result = await useCase.execute({ id: 'env-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteErrors.CanNotBeDeleted);
      expect(repo.delete).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getById.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ id: 'env-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve excluir envelope personalizado com sucesso', async () => {
      repo.getById.mockResolvedValue(makeEnvelope('Viagem'));
      repo.delete.mockResolvedValue(true);
      const result = await useCase.execute({ id: 'env-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(repo.delete).toHaveBeenCalledWith('env-uuid');
    });
  });
});
