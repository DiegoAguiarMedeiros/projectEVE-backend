import { Update } from '../Update';
import { UpdateErrors } from '../UpdateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { EnvelopesMap } from '../../../mappers';

const makeEnvelopeRepo = () => ({
  getByName: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn(),
});

const makeIncomeRepo = () => ({
  getTotal: jest.fn(),
});

const makeDebtRepo = () => ({
  getTotal: jest.fn(),
});

const makeDebtEnvelope = () => EnvelopesMap.toDomain({
  id: 'debt-env-uuid',
  name: 'debts',
  color: '#ff0000',
  order: 10,
  percentage: 20,
  user_id: 'user-uuid',
  EnvelopesAmounts: [],
});

const makeRegularEnvelope = (name = 'Alimentação', percentage = 30) => EnvelopesMap.toDomain({
  id: `env-${name}`,
  name,
  color: '#ff5733',
  order: 1,
  percentage,
  user_id: 'user-uuid',
  EnvelopesAmounts: [],
});

describe('UpdateAfterIncomeUseCase', () => {
  let useCase: Update;
  let envelopeRepo: ReturnType<typeof makeEnvelopeRepo>;
  let incomeRepo: ReturnType<typeof makeIncomeRepo>;
  let debtRepo: ReturnType<typeof makeDebtRepo>;

  beforeEach(() => {
    envelopeRepo = makeEnvelopeRepo();
    incomeRepo = makeIncomeRepo();
    debtRepo = makeDebtRepo();
    useCase = new Update(envelopeRepo as any, incomeRepo as any, debtRepo as any);
  });

  describe('errors', () => {
    it('deve retornar EnvelopeNotFound quando envelope "debts" não existe', async () => {
      envelopeRepo.getByName.mockResolvedValue(null);
      const result = await useCase.execute({ incomeId: 'income-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.EnvelopeNotFound);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      envelopeRepo.getByName.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute({ incomeId: 'income-uuid', userId: 'user-uuid' });
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve retornar sucesso quando debt percentage é zero (sem renda ou dívida)', async () => {
      envelopeRepo.getByName.mockResolvedValue(makeDebtEnvelope());
      debtRepo.getTotal.mockResolvedValue(0);
      incomeRepo.getTotal.mockResolvedValue(0);
      envelopeRepo.getAll.mockResolvedValue([makeDebtEnvelope(), makeRegularEnvelope()]);
      envelopeRepo.update.mockResolvedValue(true);

      const result = await useCase.execute({ incomeId: 'income-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
    });

    it('deve atualizar percentagem do envelope "debts" com cálculo correto', async () => {
      envelopeRepo.getByName.mockResolvedValue(makeDebtEnvelope());
      debtRepo.getTotal.mockResolvedValue(1000);
      incomeRepo.getTotal.mockResolvedValue(5000);
      envelopeRepo.getAll.mockResolvedValue([makeDebtEnvelope(), makeRegularEnvelope('Alimentação', 30)]);
      envelopeRepo.update.mockResolvedValue(true);

      const result = await useCase.execute({ incomeId: 'income-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
      expect(envelopeRepo.update).toHaveBeenCalled();
    });

    it('deve redistribuir percentagens de outros envelopes quando soma ultrapassa 100', async () => {
      const debtEnv = makeDebtEnvelope();
      const alimentacao = makeRegularEnvelope('Alimentação', 60);
      const lazer = makeRegularEnvelope('Lazer', 40);

      envelopeRepo.getByName.mockResolvedValue(debtEnv);
      debtRepo.getTotal.mockResolvedValue(2000);
      incomeRepo.getTotal.mockResolvedValue(4000);
      envelopeRepo.getAll.mockResolvedValue([debtEnv, alimentacao, lazer]);
      envelopeRepo.update.mockResolvedValue(true);

      const result = await useCase.execute({ incomeId: 'income-uuid', userId: 'user-uuid' });
      expect(result.isRight()).toBe(true);
    });
  });
});
