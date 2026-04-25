import { Incomes } from '../Income';
import { Balance } from '../../../../shared/domain/Balance';
import { Description } from '../../../../shared/domain/Description';
import { Id } from '../../../../shared/domain/Id';
import { PaymentDay } from '../../../../shared/domain/PaymentDay';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

const makeValidProps = () => ({
  userId: Id.create(new UniqueEntityID('user-uuid')).getValue(),
  description: Description.create({ description: 'Salário mensal' }).getValue(),
  amount: Balance.create({ balance: 5000 }).getValue(),
  paymentDay: PaymentDay.create({ paymentDay: 5 }).getValue(),
});

describe('Incomes', () => {
  describe('create()', () => {
    it('deve criar Incomes com props válidos', () => {
      const result = Incomes.create(makeValidProps());
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Incomes);
    });

    it('deve preservar o id fornecido', () => {
      const id = new UniqueEntityID('fixed-uuid');
      const income = Incomes.create(makeValidProps(), id).getValue();
      expect(income.id.toString()).toBe('fixed-uuid');
    });

    it('deve gerar um id quando não fornecido', () => {
      const income = Incomes.create(makeValidProps()).getValue();
      expect(income.id.toString()).toBeTruthy();
    });

    it('deve falhar quando userId é null', () => {
      const result = Incomes.create({ ...makeValidProps(), userId: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando description é null', () => {
      const result = Incomes.create({ ...makeValidProps(), description: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando amount é null', () => {
      const result = Incomes.create({ ...makeValidProps(), amount: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando paymentDay é null', () => {
      const result = Incomes.create({ ...makeValidProps(), paymentDay: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve adicionar evento IncomesCreated quando é nova entidade (sem id)', () => {
      const income = Incomes.create(makeValidProps()).getValue();
      expect(income.domainEvents).toHaveLength(1);
    });

    it('não deve adicionar evento IncomesCreated quando id é fornecido (entidade existente)', () => {
      const id = new UniqueEntityID('existing-id');
      const income = Incomes.create(makeValidProps(), id).getValue();
      expect(income.domainEvents).toHaveLength(0);
    });
  });

  describe('getters e mutators', () => {
    it('deve retornar userId correto', () => {
      const income = Incomes.create(makeValidProps()).getValue();
      expect(income.userId.id.toString()).toBe('user-uuid');
    });

    it('deve atualizar description via updateDescription()', () => {
      const income = Incomes.create(makeValidProps()).getValue();
      const newDesc = Description.create({ description: 'Freelance' }).getValue();
      income.updateDescription(newDesc);
      expect(income.description.value).toBe('Freelance');
    });

    it('deve atualizar amount via updateAmount()', () => {
      const income = Incomes.create(makeValidProps()).getValue();
      const newAmount = Balance.create({ balance: 7000 }).getValue();
      income.updateAmount(newAmount);
      expect(income.amount.value).toBe(7000);
    });

    it('deve atualizar paymentDay via updatepaymentDay()', () => {
      const income = Incomes.create(makeValidProps()).getValue();
      const newDay = PaymentDay.create({ paymentDay: 15 }).getValue();
      income.updatepaymentDay(newDay);
      expect(income.paymentDay.value).toBe(15);
    });
  });
});
