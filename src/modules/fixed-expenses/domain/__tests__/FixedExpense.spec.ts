import { FixedExpense } from '../FixedExpense';
import { Balance } from '../../../../shared/domain/Balance';
import { Description } from '../../../../shared/domain/Description';
import { Id } from '../../../../shared/domain/Id';
import { PaymentDay } from '../../../../shared/domain/PaymentDay';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

const makeValidProps = () => ({
  envelopeId: Id.create(new UniqueEntityID('env-uuid')).getValue(),
  description: Description.create({ description: 'Conta de internet' }).getValue(),
  amount: Balance.create({ balance: 120 }).getValue(),
  paymentDay: PaymentDay.create({ paymentDay: 10 }).getValue(),
});

describe('FixedExpense', () => {
  describe('create()', () => {
    it('deve criar FixedExpense com props válidos', () => {
      const result = FixedExpense.create(makeValidProps());
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(FixedExpense);
    });

    it('deve preservar o id fornecido', () => {
      const id = new UniqueEntityID('fe-uuid');
      const fe = FixedExpense.create(makeValidProps(), id).getValue();
      expect(fe.id.toString()).toBe('fe-uuid');
    });

    it('deve falhar quando envelopeId é null', () => {
      const result = FixedExpense.create({ ...makeValidProps(), envelopeId: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando description é null', () => {
      const result = FixedExpense.create({ ...makeValidProps(), description: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando amount é null', () => {
      const result = FixedExpense.create({ ...makeValidProps(), amount: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando paymentDay é null', () => {
      const result = FixedExpense.create({ ...makeValidProps(), paymentDay: null as any });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('getters e mutators', () => {
    it('deve retornar envelopeId correto', () => {
      const fe = FixedExpense.create(makeValidProps()).getValue();
      expect(fe.envelopeId.id.toString()).toBe('env-uuid');
    });

    it('deve atualizar description via updateDescription()', () => {
      const fe = FixedExpense.create(makeValidProps()).getValue();
      const newDesc = Description.create({ description: 'Conta de água' }).getValue();
      fe.updateDescription(newDesc);
      expect(fe.description.value).toBe('Conta de água');
    });

    it('deve atualizar amount via updateAmount()', () => {
      const fe = FixedExpense.create(makeValidProps()).getValue();
      const newAmount = Balance.create({ balance: 200 }).getValue();
      fe.updateAmount(newAmount);
      expect(fe.amount.value).toBe(200);
    });

    it('deve atualizar paymentDay via updatepaymentDay()', () => {
      const fe = FixedExpense.create(makeValidProps()).getValue();
      const newDay = PaymentDay.create({ paymentDay: 20 }).getValue();
      fe.updatepaymentDay(newDay);
      expect(fe.paymentDay.value).toBe(20);
    });

    it('deve atualizar envelopeId via updateEnvelopeId()', () => {
      const fe = FixedExpense.create(makeValidProps()).getValue();
      const newEnvId = Id.create(new UniqueEntityID('new-env-uuid')).getValue();
      fe.updateEnvelopeId(newEnvId);
      expect(fe.envelopeId.id.toString()).toBe('new-env-uuid');
    });
  });
});
