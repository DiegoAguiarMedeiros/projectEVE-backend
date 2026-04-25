import { GetByIdUseCase } from '../GetByIdUseCase';
import { GetByIdErrors } from '../GetByIdErrors';
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

describe('GetByIdEnvelopeUseCase', () => {
  let useCase: GetByIdUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetByIdUseCase(repo as any);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando envelope não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute({ id: 'env-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(GetByIdErrors.NotFound);
    });
  });

  describe('success', () => {
    it('deve retornar envelope quando encontrado', async () => {
      repo.getById.mockResolvedValue(makeEnvelope());
      const result = await useCase.execute({ id: 'env-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
    });

    it('deve chamar repo.getById com os parâmetros corretos', async () => {
      repo.getById.mockResolvedValue(makeEnvelope());
      await useCase.execute({ id: 'env-uuid', userId: 'user-uuid' });
      expect(repo.getById).toHaveBeenCalledWith('env-uuid', 'user-uuid');
    });
  });
});
