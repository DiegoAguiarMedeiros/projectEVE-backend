import { UpdateBaseEnvelopeAdminUseCase } from '../UpdateBaseEnvelopeAdminUseCase';
import { Interface as IBaseEnvelopeRepo } from '../../../../base-envelope/repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';
import { BaseEnvelope } from '../../../../base-envelope/domain/BaseEnvelope';
import { Name } from '../../../../../shared/domain/Name';
import { Color } from '../../../../../shared/domain/Color';
import { Balance } from '../../../../../shared/domain/Balance';
import { Percentage } from '../../../../../shared/domain/Percentage';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

const makeBaseEnvelopeStub = () =>
  BaseEnvelope.create(
    {
      name: Name.create({ name: 'Moradia' }).getValue(),
      color: Color.create({ color: '#8E33FF' }).getValue(),
      order: Balance.create({ balance: 1 }).getValue(),
      percentage: Percentage.create({ percentage: 10 }).getValue(),
    },
    new UniqueEntityID('be-uuid')
  ).getValue();

const makeBaseEnvelopeRepo = (): jest.Mocked<IBaseEnvelopeRepo> => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('UpdateBaseEnvelopeAdminUseCase', () => {
  let useCase: UpdateBaseEnvelopeAdminUseCase;
  let repo: jest.Mocked<IBaseEnvelopeRepo>;

  beforeEach(() => {
    repo = makeBaseEnvelopeRepo();
    useCase = new UpdateBaseEnvelopeAdminUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando base envelope não existe', async () => {
      repo.getById.mockResolvedValue(null);

      const result = await useCase.execute({ id: 'be-uuid', name: 'Novo Nome' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
      expect(repo.update).not.toHaveBeenCalled();
    });

    it('deve retornar UnexpectedError quando repo.update lança exceção', async () => {
      repo.getById.mockResolvedValue(makeBaseEnvelopeStub());
      repo.update.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute({ id: 'be-uuid', name: 'Novo Nome' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve atualizar base envelope existente', async () => {
      repo.getById.mockResolvedValue(makeBaseEnvelopeStub());
      repo.update.mockResolvedValue(undefined);

      const result = await useCase.execute({ id: 'be-uuid', name: 'Novo Nome', color: '#FF0000' });

      expect(result.isRight()).toBe(true);
      expect(repo.update).toHaveBeenCalledWith('be-uuid', {
        name: 'Novo Nome',
        color: '#FF0000',
        order: undefined,
        percentage: undefined,
      });
    });

    it('deve atualizar apenas os campos fornecidos', async () => {
      repo.getById.mockResolvedValue(makeBaseEnvelopeStub());
      repo.update.mockResolvedValue(undefined);

      await useCase.execute({ id: 'be-uuid', order: 2 });

      expect(repo.update).toHaveBeenCalledWith('be-uuid', {
        name: undefined,
        color: undefined,
        order: 2,
        percentage: undefined,
      });
    });
  });
});
