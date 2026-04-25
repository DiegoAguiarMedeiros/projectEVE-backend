import { GetAnalyticsCurrentEnvelopesUseCase } from '../GetAnalyticsCurrentEnvelopesUseCase';
import { Interface as IEnvelopesRepo } from '../../../../envelopes/repos/Interface';

const makeEnvelopesRepo = (): jest.Mocked<Pick<IEnvelopesRepo, 'getAnalyticsCurrentEnvelopes'>> => ({
  getAnalyticsCurrentEnvelopes: jest.fn(),
});

const mockAnalyticsData = {
  envelopes: [
    { id: 'env-1', name: 'Alimentação', allocated: 500, used: 300, percentage: 60 },
  ],
};

describe('GetAnalyticsCurrentEnvelopesUseCase', () => {
  let useCase: GetAnalyticsCurrentEnvelopesUseCase;
  let envelopesRepo: jest.Mocked<any>;

  beforeEach(() => {
    envelopesRepo = makeEnvelopesRepo();
    useCase = new GetAnalyticsCurrentEnvelopesUseCase(envelopesRepo as any);
  });

  describe('success', () => {
    it('deve retornar dados de analytics dos envelopes atuais', async () => {
      envelopesRepo.getAnalyticsCurrentEnvelopes.mockResolvedValue(mockAnalyticsData);
      const result = await useCase.execute({ id: 'user-uuid', year: 2026, month: 3 });
      expect(result.isRight()).toBe(true);
      expect(result.value.getValue()).toEqual(mockAnalyticsData);
    });

    it('deve chamar repo com os parâmetros corretos', async () => {
      envelopesRepo.getAnalyticsCurrentEnvelopes.mockResolvedValue(mockAnalyticsData);
      await useCase.execute({ id: 'user-uuid', year: 2026, month: 3 });
      expect(envelopesRepo.getAnalyticsCurrentEnvelopes).toHaveBeenCalledWith('user-uuid', 2026, 3);
    });

    it('deve retornar dados vazios quando não há envelopes', async () => {
      envelopesRepo.getAnalyticsCurrentEnvelopes.mockResolvedValue({ envelopes: [] });
      const result = await useCase.execute({ id: 'user-uuid', year: 2026, month: 3 });
      expect(result.isRight()).toBe(true);
    });
  });
});
