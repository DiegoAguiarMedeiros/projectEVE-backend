import { Update } from '../Update';
import { AppError } from '../../../../../shared/core/AppError';

const makeEnvelopeRepo = () => ({
  addAmount: jest.fn(),
});

describe('UpdateAmountEnvelopeUseCase', () => {
  let useCase: Update;
  let envelopeRepo: ReturnType<typeof makeEnvelopeRepo>;

  beforeEach(() => {
    envelopeRepo = makeEnvelopeRepo();
    useCase = new Update(envelopeRepo as any);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      envelopeRepo.addAmount.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ envelopeId: 'env-uuid', amount: 1500, year: 2026, month: 3 });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve atualizar amount de envelope com sucesso', async () => {
      envelopeRepo.addAmount.mockResolvedValue(undefined);
      const result = await useCase.execute({ envelopeId: 'env-uuid', amount: 1500, year: 2026, month: 3 });
      expect(result.isRight()).toBe(true);
    });

    it('deve chamar repo.addAmount com os parâmetros corretos', async () => {
      envelopeRepo.addAmount.mockResolvedValue(undefined);
      await useCase.execute({ envelopeId: 'env-uuid', amount: 1500, year: 2026, month: 3 });
      expect(envelopeRepo.addAmount).toHaveBeenCalledWith('env-uuid', 1500, 2026, 3);
    });
  });
});
