import { DeleteBaseEnvelopeAdminUseCase } from '../DeleteBaseEnvelopeAdminUseCase';
import { Interface as IBaseEnvelopeRepo } from '../../../../base-envelope/repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';

const makeBaseEnvelopeRepo = (): jest.Mocked<IBaseEnvelopeRepo> => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('DeleteBaseEnvelopeAdminUseCase', () => {
  let useCase: DeleteBaseEnvelopeAdminUseCase;
  let repo: jest.Mocked<IBaseEnvelopeRepo>;

  beforeEach(() => {
    repo = makeBaseEnvelopeRepo();
    useCase = new DeleteBaseEnvelopeAdminUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.delete.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute({ id: 'be-uuid' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve deletar base envelope e retornar sucesso', async () => {
      repo.delete.mockResolvedValue(undefined);

      const result = await useCase.execute({ id: 'be-uuid' });

      expect(result.isRight()).toBe(true);
      expect(repo.delete).toHaveBeenCalledWith('be-uuid');
    });
  });
});
