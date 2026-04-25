import { CreateUseCase } from '../CreateUseCase';
import { CreateErrors } from '../CreateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IDebtRepo } from '../../../repos/Interface';
import { Interface as IEnvelopeRepo } from '../../../../envelopes/repos/Interface';

const makeDebtRepo = (): jest.Mocked<IDebtRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getOnlyById: jest.fn(),
  getTotal: jest.fn(),
  deleteAll: jest.fn(),
  updateInstallmentsPaid: jest.fn(),
});

const makeEnvelopeRepo = (): jest.Mocked<Pick<IEnvelopeRepo, 'getById'>> => ({
  getById: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  userId: 'user-uuid',
  envelopeId: 'env-uuid',
  description: 'Financiamento carro',
  amount: 800,
  installmentsTotal: 48,
  installmentsPaid: 6,
  paymentDay: 10,
  status: 'debt.status.pending' as const,
  ...overrides,
});

describe('CreateDebtUseCase', () => {
  let useCase: CreateUseCase;
  let debtRepo: jest.Mocked<IDebtRepo>;
  let envelopeRepo: jest.Mocked<any>;

  beforeEach(() => {
    debtRepo = makeDebtRepo();
    envelopeRepo = makeEnvelopeRepo();
    useCase = new CreateUseCase(debtRepo, envelopeRepo as any);
  });

  describe('errors', () => {
    it('deve retornar EnvelopeNotFound quando envelope não existe', async () => {
      envelopeRepo.getById.mockResolvedValue(null);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(CreateErrors.EnvelopeNotFound);
    });

    it('não deve chamar debtRepo.create quando envelope não é encontrado', async () => {
      envelopeRepo.getById.mockResolvedValue(null);
      await useCase.execute(makeRequest());
      expect(debtRepo.create).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando description é inválida (vazia)', async () => {
      envelopeRepo.getById.mockResolvedValue({ id: 'env-uuid' });
      const result = await useCase.execute(makeRequest({ description: '' }));
      expect(result.isLeft()).toBe(true);
      expect(debtRepo.create).not.toHaveBeenCalled();
    });

    it('deve retornar falha quando paymentDay é inválido (0)', async () => {
      envelopeRepo.getById.mockResolvedValue({ id: 'env-uuid' });
      const result = await useCase.execute(makeRequest({ paymentDay: 0 }));
      expect(result.isLeft()).toBe(true);
      expect(debtRepo.create).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      envelopeRepo.getById.mockResolvedValue({ id: 'env-uuid' });
      debtRepo.create.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve criar debt com sucesso', async () => {
      envelopeRepo.getById.mockResolvedValue({ id: 'env-uuid' });
      debtRepo.create.mockResolvedValue(undefined);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(debtRepo.create).toHaveBeenCalledTimes(1);
    });

    it('deve criar debt com os valores corretos', async () => {
      envelopeRepo.getById.mockResolvedValue({ id: 'env-uuid' });
      debtRepo.create.mockResolvedValue(undefined);
      await useCase.execute(makeRequest());
      const [debt] = debtRepo.create.mock.calls[0];
      expect(debt.description.value).toBe('Financiamento carro');
      expect(debt.amount.value).toBe(800);
      expect(debt.installmentsTotal.value).toBe(48);
      expect(debt.installmentsPaid.value).toBe(6);
      expect(debt.paymentDay.value).toBe(10);
      expect(debt.status).toBe('debt.status.pending');
    });
  });
});
