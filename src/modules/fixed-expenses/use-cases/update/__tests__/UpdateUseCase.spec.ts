import { UpdateUseCase } from '../UpdateUseCase';
import { UpdateErrors } from '../UpdateErrors';
import { AppError } from '../../../../../shared/core/AppError';
import { Interface as IFixedExpenseRepo } from '../../../repos/Interface';
import { Interface as IEnvelopeRepo } from '../../../../envelopes/repos/Interface';
import { FixedExpenseMap } from '../../../mappers';
import { EnvelopesMap } from '../../../../envelopes/mappers';

const makeRepo = (): jest.Mocked<IFixedExpenseRepo> => ({
  getAll: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
  getTotalByEnvelope: jest.fn(),
});

const makeEnvelopeRepo = (): jest.Mocked<Pick<IEnvelopeRepo, 'getById'>> => ({
  getById: jest.fn(),
});

const makeFE = () => FixedExpenseMap.toDomain({
  id: 'fe-uuid',
  envelope_id: 'env-uuid',
  description: 'Conta de internet',
  amount: 120,
  payment_day: 10,
});

const makeEnvelope = () => EnvelopesMap.toDomain({
  id: 'env-uuid',
  name: 'Moradia',
  color: '#ffffff',
  order: 1,
  percentage: 30,
  user_id: 'user-uuid',
  EnvelopesAmounts: [],
});

const makeRequest = (overrides = {}) => ({
  request: { id: 'fe-uuid', userId: 'user-uuid' },
  fieldUpdate: { envelopeId: 'env-uuid', description: 'Conta de água', amount: 80, paymentDay: 15 },
  ...overrides,
});

describe('UpdateFixedExpenseUseCase', () => {
  let useCase: UpdateUseCase;
  let repo: jest.Mocked<IFixedExpenseRepo>;
  let envelopeRepo: jest.Mocked<any>;

  beforeEach(() => {
    repo = makeRepo();
    envelopeRepo = makeEnvelopeRepo();
    useCase = new UpdateUseCase(repo, envelopeRepo);
  });

  describe('errors', () => {
    it('deve retornar NotFound quando fixed expense não existe', async () => {
      repo.getById.mockResolvedValue(null);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.NotFound);
    });

    it('deve retornar EnvelopeNotFound quando envelope não existe', async () => {
      repo.getById.mockResolvedValue(makeFE());
      envelopeRepo.getById.mockResolvedValue(null);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.EnvelopeNotFound);
    });

    it('deve retornar UpdateError quando repo.update retorna false', async () => {
      repo.getById.mockResolvedValue(makeFE());
      envelopeRepo.getById.mockResolvedValue(makeEnvelope());
      repo.update.mockResolvedValue(false);
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UpdateErrors.UpdateError);
    });

    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getById.mockRejectedValue(new Error('DB offline'));
      const result = await useCase.execute(makeRequest());
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });

    it('deve retornar falha quando paymentDay é inválido', async () => {
      repo.getById.mockResolvedValue(makeFE());
      envelopeRepo.getById.mockResolvedValue(makeEnvelope());
      const result = await useCase.execute(makeRequest({
        fieldUpdate: { envelopeId: 'env-uuid', description: 'Teste', amount: 100, paymentDay: 99 },
      }));
      expect(result.isLeft()).toBe(true);
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('deve atualizar fixed expense com sucesso', async () => {
      repo.getById.mockResolvedValue(makeFE());
      envelopeRepo.getById.mockResolvedValue(makeEnvelope());
      repo.update.mockResolvedValue(true);
      const result = await useCase.execute(makeRequest());
      expect(result.isRight()).toBe(true);
      expect(repo.update).toHaveBeenCalledTimes(1);
    });

    it('deve atualizar campos corretamente', async () => {
      repo.getById.mockResolvedValue(makeFE());
      envelopeRepo.getById.mockResolvedValue(makeEnvelope());
      repo.update.mockResolvedValue(true);
      await useCase.execute(makeRequest());
      const [, updated] = repo.update.mock.calls[0];
      expect(updated.description.value).toBe('Conta de água');
      expect(updated.amount.value).toBe(80);
      expect(updated.paymentDay.value).toBe(15);
    });
  });
});
