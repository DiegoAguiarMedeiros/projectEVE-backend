import { Goals } from '../Goals';
import { Balance } from '../../../../shared/domain/Balance';
import { Description } from '../../../../shared/domain/Description';
import { Id } from '../../../../shared/domain/Id';
import { Percentage } from '../../../../shared/domain/Percentage';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

const makeValidProps = () => ({
  envelopeId: Id.create(new UniqueEntityID('env-uuid')).getValue(),
  description: Description.create({ description: 'Comprar carro' }).getValue(),
  amount: Balance.create({ balance: 500 }).getValue(),
  amountTotal: Balance.create({ balance: 50000 }).getValue(),
  percentage: Percentage.create({ percentage: 1 }).getValue(),
  deadline: new Date('2030-01-01'),
});

describe('Goals', () => {
  describe('create()', () => {
    it('deve criar Goals com props válidos', () => {
      const result = Goals.create(makeValidProps());
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Goals);
    });

    it('deve preservar o id fornecido', () => {
      const id = new UniqueEntityID('goal-uuid');
      const goal = Goals.create(makeValidProps(), id).getValue();
      expect(goal.id.toString()).toBe('goal-uuid');
    });

    it('deve falhar quando envelopeId é null', () => {
      const result = Goals.create({ ...makeValidProps(), envelopeId: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando description é null', () => {
      const result = Goals.create({ ...makeValidProps(), description: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando amount é null', () => {
      const result = Goals.create({ ...makeValidProps(), amount: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando percentage é null', () => {
      const result = Goals.create({ ...makeValidProps(), percentage: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando deadline é null', () => {
      const result = Goals.create({ ...makeValidProps(), deadline: null as any });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('getters e mutators', () => {
    it('deve retornar envelopeId correto', () => {
      const goal = Goals.create(makeValidProps()).getValue();
      expect(goal.envelopeId.id.toString()).toBe('env-uuid');
    });

    it('deve atualizar description via updateDescription()', () => {
      const goal = Goals.create(makeValidProps()).getValue();
      const newDesc = Description.create({ description: 'Comprar casa' }).getValue();
      goal.updateDescription(newDesc);
      expect(goal.description.value).toBe('Comprar casa');
    });

    it('deve atualizar amount via updateAmount()', () => {
      const goal = Goals.create(makeValidProps()).getValue();
      const newAmount = Balance.create({ balance: 1000 }).getValue();
      goal.updateAmount(newAmount);
      expect(goal.amount.value).toBe(1000);
    });

    it('deve atualizar amountTotal via updateAmountTotal()', () => {
      const goal = Goals.create(makeValidProps()).getValue();
      const newTotal = Balance.create({ balance: 100000 }).getValue();
      goal.updateAmountTotal(newTotal);
      expect(goal.amountTotal.value).toBe(100000);
    });

    it('deve atualizar deadline via updateDeadline()', () => {
      const goal = Goals.create(makeValidProps()).getValue();
      const newDeadline = new Date('2035-06-15');
      goal.updateDeadline(newDeadline);
      expect(goal.deadline).toEqual(newDeadline);
    });
  });
});
