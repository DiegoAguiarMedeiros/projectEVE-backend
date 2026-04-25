import { GetAllUseCase } from '../GetAllUseCase';
import { Interface as IEnvelopeRepo } from '../../../repos/Interface';
import { EnvelopesMap } from '../../../mappers';

const makeRepo = (): jest.Mocked<Pick<IEnvelopeRepo, 'getAllMonthly' | 'getUsedByEnvelopeID'>> => ({
  getAllMonthly: jest.fn(),
  getUsedByEnvelopeID: jest.fn(),
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

describe('GetAllMonthlyEnvelopesUseCase', () => {
  let useCase: GetAllUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetAllUseCase(repo as any);
  });

  describe('success', () => {
    it('deve retornar lista de DTOs com used atualizado', async () => {
      repo.getAllMonthly.mockResolvedValue([makeEnvelope()]);
      repo.getUsedByEnvelopeID.mockResolvedValue(60);
      const result = await useCase.execute({ id: 'user-uuid', year: 2026, month: 3 });
      expect(result.isRight()).toBe(true);
      const data = (result.value as any).getValue();
      expect(data).toHaveLength(1);
      expect(data[0].used).toBe(60);
    });

    it('deve retornar lista vazia quando não há envelopes mensais', async () => {
      repo.getAllMonthly.mockResolvedValue([]);
      const result = await useCase.execute({ id: 'user-uuid', year: 2026, month: 3 });
      expect(result.isRight()).toBe(true);
      const data = (result.value as any).getValue();
      expect(data).toHaveLength(0);
    });

    it('deve chamar repo com os parâmetros corretos', async () => {
      repo.getAllMonthly.mockResolvedValue([]);
      await useCase.execute({ id: 'user-uuid', year: 2026, month: 3 });
      expect(repo.getAllMonthly).toHaveBeenCalledWith('user-uuid', 2026, 3);
    });

    it('deve ignorar used inválido (> 100) e manter o envelope sem atualizar used', async () => {
      repo.getAllMonthly.mockResolvedValue([makeEnvelope()]);
      repo.getUsedByEnvelopeID.mockResolvedValue(150);
      const result = await useCase.execute({ id: 'user-uuid', year: 2026, month: 3 });
      expect(result.isRight()).toBe(true);
      const data = (result.value as any).getValue();
      expect(data[0].used).toBeUndefined();
    });
  });
});
