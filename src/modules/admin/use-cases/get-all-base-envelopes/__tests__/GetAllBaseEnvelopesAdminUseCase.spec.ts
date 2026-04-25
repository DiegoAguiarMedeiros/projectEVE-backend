import { GetAllBaseEnvelopesAdminUseCase } from '../GetAllBaseEnvelopesAdminUseCase';
import { Interface as IBaseEnvelopeRepo } from '../../../../base-envelope/repos/Interface';
import { AppError } from '../../../../../shared/core/AppError';
import { BaseEnvelope } from '../../../../base-envelope/domain/BaseEnvelope';
import { Name } from '../../../../../shared/domain/Name';
import { Color } from '../../../../../shared/domain/Color';
import { Balance } from '../../../../../shared/domain/Balance';
import { Percentage } from '../../../../../shared/domain/Percentage';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

const makeBaseEnvelopeStub = (overrides: { id?: string; name?: string } = {}) =>
  BaseEnvelope.create(
    {
      name: Name.create({ name: overrides.name ?? 'Moradia' }).getValue(),
      color: Color.create({ color: '#8E33FF' }).getValue(),
      order: Balance.create({ balance: 1 }).getValue(),
      percentage: Percentage.create({ percentage: 10 }).getValue(),
    },
    new UniqueEntityID(overrides.id ?? 'be-uuid')
  ).getValue();

const makeBaseEnvelopeRepo = (): jest.Mocked<IBaseEnvelopeRepo> => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('GetAllBaseEnvelopesAdminUseCase', () => {
  let useCase: GetAllBaseEnvelopesAdminUseCase;
  let repo: jest.Mocked<IBaseEnvelopeRepo>;

  beforeEach(() => {
    repo = makeBaseEnvelopeRepo();
    useCase = new GetAllBaseEnvelopesAdminUseCase(repo);
  });

  describe('errors', () => {
    it('deve retornar UnexpectedError quando repo lança exceção', async () => {
      repo.getAll.mockRejectedValue(new Error('DB error'));

      const result = await useCase.execute();

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(AppError.UnexpectedError);
    });
  });

  describe('success', () => {
    it('deve retornar lista de base envelopes como DTOs', async () => {
      const envelopes = [makeBaseEnvelopeStub(), makeBaseEnvelopeStub({ id: 'be-2', name: 'Mercado' })];
      repo.getAll.mockResolvedValue(envelopes);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);
      const dtos = result.value.getValue() as any[];
      expect(dtos).toHaveLength(2);
      expect(dtos[0].id).toBe('be-uuid');
      expect(dtos[0].name).toBe('Moradia');
      expect(dtos[1].name).toBe('Mercado');
    });

    it('deve retornar lista vazia quando não há base envelopes', async () => {
      repo.getAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);
      expect((result.value.getValue() as any[]).length).toBe(0);
    });

    it('deve mapear campos corretamente para AdminBaseEnvelopeDTO', async () => {
      repo.getAll.mockResolvedValue([makeBaseEnvelopeStub()]);

      const result = await useCase.execute();

      const dto = (result.value.getValue() as any[])[0];
      expect(dto).toHaveProperty('id');
      expect(dto).toHaveProperty('name');
      expect(dto).toHaveProperty('color');
      expect(dto).toHaveProperty('order');
    });
  });
});
