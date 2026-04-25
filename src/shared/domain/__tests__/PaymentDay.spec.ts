import { PaymentDay } from '../PaymentDay';

describe('PaymentDay', () => {
  describe('create()', () => {
    it('deve criar com dia válido (15)', () => {
      const result = PaymentDay.create({ paymentDay: 15 });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe(15);
    });

    it('deve criar com dia mínimo (1)', () => {
      const result = PaymentDay.create({ paymentDay: 1 });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe(1);
    });

    it('deve criar com dia máximo (31)', () => {
      const result = PaymentDay.create({ paymentDay: 31 });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe(31);
    });

    it('deve falhar com null', () => {
      const result = PaymentDay.create({ paymentDay: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com undefined', () => {
      const result = PaymentDay.create({ paymentDay: undefined as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com dia menor que 1 (0)', () => {
      const result = PaymentDay.create({ paymentDay: 0 });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com dia maior que 31 (32)', () => {
      const result = PaymentDay.create({ paymentDay: 32 });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar com dia negativo', () => {
      const result = PaymentDay.create({ paymentDay: -5 });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('equals()', () => {
    it('dois PaymentDay com mesmo valor devem ser iguais', () => {
      const a = PaymentDay.create({ paymentDay: 10 }).getValue();
      const b = PaymentDay.create({ paymentDay: 10 }).getValue();
      expect(a.equals(b)).toBe(true);
    });

    it('dois PaymentDay com valores diferentes não devem ser iguais', () => {
      const a = PaymentDay.create({ paymentDay: 10 }).getValue();
      const b = PaymentDay.create({ paymentDay: 20 }).getValue();
      expect(a.equals(b)).toBe(false);
    });
  });
});
