import { Debt } from '../Debt';
import { Balance } from '../../../../shared/domain/Balance';
import { Description } from '../../../../shared/domain/Description';
import { Id } from '../../../../shared/domain/Id';
import { PaymentDay } from '../../../../shared/domain/PaymentDay';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

const makeValidProps = () => ({
  description: Description.create({ description: 'Financiamento carro' }).getValue(),
  amount: Balance.create({ balance: 800 }).getValue(),
  installmentsTotal: Balance.create({ balance: 48 }).getValue(),
  installmentsPaid: Balance.create({ balance: 6 }).getValue(),
  paymentDay: PaymentDay.create({ paymentDay: 10 }).getValue(),
  status: 'debt.status.pending' as const,
  envelopeId: Id.create(new UniqueEntityID('env-uuid')).getValue(),
});

describe('Debt', () => {
  describe('create()', () => {
    it('deve criar Debt com props válidos', () => {
      const result = Debt.create(makeValidProps());
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Debt);
    });

    it('deve preservar o id fornecido', () => {
      const id = new UniqueEntityID('debt-uuid');
      const debt = Debt.create(makeValidProps(), id).getValue();
      expect(debt.id.toString()).toBe('debt-uuid');
    });

    it('deve falhar quando description é null', () => {
      const result = Debt.create({ ...makeValidProps(), description: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando amount é null', () => {
      const result = Debt.create({ ...makeValidProps(), amount: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando installmentsTotal é null', () => {
      const result = Debt.create({ ...makeValidProps(), installmentsTotal: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando installmentsPaid é null', () => {
      const result = Debt.create({ ...makeValidProps(), installmentsPaid: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando paymentDay é null', () => {
      const result = Debt.create({ ...makeValidProps(), paymentDay: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando status é null', () => {
      const result = Debt.create({ ...makeValidProps(), status: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando envelopeId é null', () => {
      const result = Debt.create({ ...makeValidProps(), envelopeId: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve adicionar evento DebtCreated quando é nova entidade', () => {
      const debt = Debt.create(makeValidProps()).getValue();
      expect(debt.domainEvents).toHaveLength(1);
    });

    it('não deve adicionar evento DebtCreated quando id é fornecido', () => {
      const id = new UniqueEntityID('existing-id');
      const debt = Debt.create(makeValidProps(), id).getValue();
      expect(debt.domainEvents).toHaveLength(0);
    });
  });

  describe('getters e mutators', () => {
    it('deve retornar status correto', () => {
      const debt = Debt.create(makeValidProps()).getValue();
      expect(debt.status).toBe('debt.status.pending');
    });

    it('deve atualizar description via updateDescription()', () => {
      const debt = Debt.create(makeValidProps()).getValue();
      const newDesc = Description.create({ description: 'Empréstimo pessoal' }).getValue();
      debt.updateDescription(newDesc);
      expect(debt.description.value).toBe('Empréstimo pessoal');
    });

    it('deve atualizar status via updateStatus()', () => {
      const debt = Debt.create(makeValidProps()).getValue();
      debt.updateStatus('debt.status.paid');
      expect(debt.status).toBe('debt.status.paid');
    });

    it('deve atualizar installmentsPaid via updateInstallmentsPaid()', () => {
      const debt = Debt.create(makeValidProps()).getValue();
      const newPaid = Balance.create({ balance: 12 }).getValue();
      debt.updateInstallmentsPaid(newPaid);
      expect(debt.installmentsPaid.value).toBe(12);
    });
  });
});
