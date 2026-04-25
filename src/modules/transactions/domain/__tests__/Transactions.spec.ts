import { Transactions } from '../Transactions';
import { Balance } from '../../../../shared/domain/Balance';
import { Description } from '../../../../shared/domain/Description';
import { Id } from '../../../../shared/domain/Id';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

const makeValidProps = () => ({
  description: Description.create({ description: 'Compra no mercado' }).getValue(),
  amount: Balance.create({ balance: 150 }).getValue(),
  date: new Date('2026-03-01'),
  type: 'Debit' as const,
  paymentMethod: 'envelope.transaction.payment_method.Pix' as const,
  status: 'transaction.status.completed' as const,
  envelopeId: Id.create(new UniqueEntityID('env-uuid')).getValue(),
});

describe('Transactions', () => {
  describe('create()', () => {
    it('deve criar Transactions com props válidos', () => {
      const result = Transactions.create(makeValidProps());
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Transactions);
    });

    it('deve preservar o id fornecido', () => {
      const id = new UniqueEntityID('tx-uuid');
      const tx = Transactions.create(makeValidProps(), id).getValue();
      expect(tx.id.toString()).toBe('tx-uuid');
    });

    it('deve criar com props opcionais (creditCardId, debtId)', () => {
      const result = Transactions.create({
        ...makeValidProps(),
        creditCardId: Id.create(new UniqueEntityID('cc-uuid')).getValue(),
        debtId: Id.create(new UniqueEntityID('debt-uuid')).getValue(),
      });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().creditCardId!.id.toString()).toBe('cc-uuid');
    });

    it('deve falhar quando envelopeId é null', () => {
      const result = Transactions.create({ ...makeValidProps(), envelopeId: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando description é null', () => {
      const result = Transactions.create({ ...makeValidProps(), description: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando amount é null', () => {
      const result = Transactions.create({ ...makeValidProps(), amount: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando date é null', () => {
      const result = Transactions.create({ ...makeValidProps(), date: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando status é null', () => {
      const result = Transactions.create({ ...makeValidProps(), status: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve adicionar evento TransactionsCreated quando é nova entidade', () => {
      const tx = Transactions.create(makeValidProps()).getValue();
      expect(tx.domainEvents).toHaveLength(1);
    });

    it('não deve adicionar evento TransactionsCreated quando id é fornecido', () => {
      const id = new UniqueEntityID('existing-id');
      const tx = Transactions.create(makeValidProps(), id).getValue();
      expect(tx.domainEvents).toHaveLength(0);
    });
  });

  describe('getters e mutators', () => {
    it('deve retornar isTranslatable como false por padrão', () => {
      const tx = Transactions.create(makeValidProps()).getValue();
      expect(tx.isTranslatable).toBe(false);
    });

    it('deve atualizar description via updateDescription()', () => {
      const tx = Transactions.create(makeValidProps()).getValue();
      const newDesc = Description.create({ description: 'Conta de luz' }).getValue();
      tx.updateDescription(newDesc);
      expect(tx.description.value).toBe('Conta de luz');
    });

    it('deve atualizar status via updateStatus()', () => {
      const tx = Transactions.create(makeValidProps()).getValue();
      tx.updateStatus('transaction.status.pending');
      expect(tx.status).toBe('transaction.status.pending');
    });

    it('deve atualizar paymentMethod via updatePaymentMethod()', () => {
      const tx = Transactions.create(makeValidProps()).getValue();
      tx.updatePaymentMethod('envelope.transaction.payment_method.Cash');
      expect(tx.paymentMethod).toBe('envelope.transaction.payment_method.Cash');
    });
  });
});
