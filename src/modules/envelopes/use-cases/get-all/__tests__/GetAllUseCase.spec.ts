import { GetAllUseCase } from '../GetAllUseCase';
import { Interface as IEnvelopeRepo } from '../../../repos/Interface';
import { EnvelopesMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<Pick<IEnvelopeRepo, 'getAll'>> => ({
  getAll: jest.fn(),
});

const makeEnvelope = () => EnvelopesMap.toDomain({
  id: 'env-uuid',
  name: 'Alimentação',
  color: '#ff5733',
  order: 1,
  percentage: 30,
  user_id: 'user-uuid',
  EnvelopesAmounts: [{ amount: 1500 }],
});

describe('GetAllEnvelopesUseCase', () => {
  let useCase: GetAllUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetAllUseCase(repo as any);
  });

  describe('success', () => {
    it('deve retornar lista de DTOs de envelopes', async () => {
      repo.getAll.mockResolvedValue([makeEnvelope()]);
      const result = await useCase.execute('user-uuid');
      expect(result.isRight()).toBe(true);
      const data = (result.value as any).getValue();
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Alimentação');
    });

    it('deve retornar lista vazia quando não há envelopes', async () => {
      repo.getAll.mockResolvedValue([]);
      const result = await useCase.execute('user-uuid');
      expect(result.isRight()).toBe(true);
      const data = (result.value as any).getValue();
      expect(data).toHaveLength(0);
    });

    it('deve chamar repo.getAll com userId correto', async () => {
      repo.getAll.mockResolvedValue([]);
      await useCase.execute('user-uuid');
      expect(repo.getAll).toHaveBeenCalledWith('user-uuid');
    });
  });
});
