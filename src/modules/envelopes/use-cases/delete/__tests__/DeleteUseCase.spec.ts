import { DeleteUseCase } from '../DeleteUseCase';
import { DeleteErrors } from '../DeleteErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IEnvelopeRepo } from '../../../repos/Interface';
import { EnvelopesMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<Pick<IEnvelopeRepo, 'getById'>> => ({
  getById: jest.fn(),
});

const makeEnvelope = () => EnvelopesMap.toDomain({
  id: 'env-uuid',
  name: 'Alimentação',
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
    });

    it('deve retornar CanNotBeDeleted quando envelope existe (sempre)', async () => {
      repo.getById.mockResolvedValue(makeEnvelope());
      const result = await useCase.execute({ id: 'env-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DeleteErrors.CanNotBeDeleted);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getById.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ id: 'env-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });
});
