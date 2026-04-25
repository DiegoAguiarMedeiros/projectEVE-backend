import { CreateBaseEnvelopeAdminUseCase } from '../CreateBaseEnvelopeAdminUseCase';
import { Interface as IBaseEnvelopeRepo } from '../../../../base-envelope/repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';

const makeBaseEnvelopeRepo = (): jest.Mocked<IBaseEnvelopeRepo> => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makeRequest = (overrides = {}) => ({
  name: 'Moradia',
  color: '#8E33FF',
  order: 1,
  percentage: 10,
  ...overrides,
});

describe('CreateBaseEnvelopeAdminUseCase', () => {
  let useCase: CreateBaseEnvelopeAdminUseCase;
  let repo: jest.Mocked<IBaseEnvelopeRepo>;

  beforeEach(() => {
    repo = makeBaseEnvelopeRepo();
    useCase = new CreateBaseEnvelopeAdminUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando name é null', async () => {
      const result = await useCase.execute(makeRequest({ name: null }));

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando color é null', async () => {
      const result = await useCase.execute(makeRequest({ color: null }));

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando order é null', async () => {
      const result = await useCase.execute(makeRequest({ order: null }));

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando color tem formato inválido', async () => {
      const result = await useCase.execute(makeRequest({ color: 'not-a-color' }));

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });

    it('deve retornar UnexpectedError quando repo.save lança exceção', async () => {
      repo.save.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute(makeRequest());

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve criar base envelope e chamar repo.save', async () => {
      repo.save.mockResolvedValue(undefined);

      const result = await useCase.execute(makeRequest());

      expect(result.isRight()).toBe(true);
      expect(repo.save).toHaveBeenCalledTimes(1);
    });
  });
});
