import { Transactions } from '../../modules/transactions/domain/Transactions';
import { Balance } from '../domain/Balance';
import { Description } from '../domain/Description';
import { Id } from '../domain/Id';
import { UniqueEntityID } from '../domain/UniqueEntityID';
import { TransactionsStatus } from '../../modules/transactions/domain/TransactionsStatus';
import { PaymentMethod } from '../../modules/transactions/domain/PaymentMethod';
import { TransactionsType } from '../../modules/transactions/domain/TransactionsType';

interface TransactionStubOverrides {
  id?: string;
  envelopeId?: string;
  description?: string;
  amount?: number;
  date?: Date;
  type?: TransactionsType;
  paymentMethod?: PaymentMethod;
  status?: TransactionsStatus;
  debtId?: string;
  processedIncomesId?: string;
  creditCardId?: string;
}

export const makeTransactionStub = (overrides: TransactionStubOverrides = {}): Transactions => {
  const props = {
    description: Description.create({ description: overrides.description ?? 'Test transaction' }).getValue(),
    amount: Balance.create({ balance: overrides.amount ?? 100 }).getValue(),
    date: overrides.date ?? new Date('2026-03-01'),
    type: (overrides.type ?? 'Debit') as TransactionsType,
    paymentMethod: (overrides.paymentMethod ?? 'envelope.transaction.payment_method.Pix') as PaymentMethod,
    status: (overrides.status ?? 'transaction.status.pending') as TransactionsStatus,
    envelopeId: Id.create(new UniqueEntityID(overrides.envelopeId ?? 'env-uuid')).getValue(),
    ...(overrides.debtId ? { debtId: Id.create(new UniqueEntityID(overrides.debtId)).getValue() } : {}),
    ...(overrides.processedIncomesId ? { processedIncomesId: Id.create(new UniqueEntityID(overrides.processedIncomesId)).getValue() } : {}),
    ...(overrides.creditCardId ? { creditCardId: Id.create(new UniqueEntityID(overrides.creditCardId)).getValue() } : {}),
  };
  return Transactions.create(props, new UniqueEntityID(overrides.id ?? 'tx-uuid')).getValue();
};
