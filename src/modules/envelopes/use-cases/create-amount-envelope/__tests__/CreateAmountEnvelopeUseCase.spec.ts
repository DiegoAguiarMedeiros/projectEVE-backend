import { Create } from '../Create';
import { AppError } from '../../../../../shared/core/AppError';

const makeEnvelopeRepo = () => ({
  createAmount: jest.fn(),
});

describe('CreateAmountEnvelopeUseCase', () => {
  let useCase: Create;
  let envelopeRepo: ReturnType<typeof makeEnvelopeRepo>;

  beforeEach(() => {
    envelopeRepo = makeEnvelopeRepo();
    useCase = new Create(envelopeRepo as any);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      envelopeRepo.createAmount.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ envelopeId: 'env-uuid', amount: 1500, year: 2026, month: 3 });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve criar amount de envelope com sucesso', async () => {
      envelopeRepo.createAmount.mockResolvedValue(undefined);
      const result = await useCase.execute({ envelopeId: 'env-uuid', amount: 1500, year: 2026, month: 3 });
      expect(result.isRight()).toBe(true);
    });

    it('deve chamar repo.createAmount com os parâmetros corretos', async () => {
      envelopeRepo.createAmount.mockResolvedValue(undefined);
      await useCase.execute({ envelopeId: 'env-uuid', amount: 1500, year: 2026, month: 3 });
      expect(envelopeRepo.createAmount).toHaveBeenCalledWith('env-uuid', 1500, 2026, 3);
    });
  });
});
