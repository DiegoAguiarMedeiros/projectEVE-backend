import { GoalsMap } from '../index';

const rawDb = {
  id: 'goal-uuid',
  envelope_id: 'env-uuid',
  description: 'Comprar carro',
  amount: 500,
  amount_total: 50000,
  percentage: 1,
  deadline: 10,
  month_year: true,
};

describe('GoalsMap', () => {
  describe('toDomain()', () => {
    it('deve mapear raw DB para entidade Goals', () => {
      const goal = GoalsMap.toDomain(rawDb);
      expect(goal.id.toString()).toBe('goal-uuid');
      expect(goal.description.value).toBe('Comprar carro');
      expect(goal.amount.value).toBe(500);
      expect(goal.amountTotal.value).toBe(50000);
      expect(goal.percentage.value).toBe(1);
    });

    it('deve mapear deadline corretamente', () => {
      const goal = GoalsMap.toDomain(rawDb);
      expect(goal.deadline).toEqual(rawDb.deadline);
      expect(goal.monthYear).toBe(true);
    });
  });

  describe('toDTO()', () => {
    it('deve mapear Goals para DTO serializável', () => {
      const goal = GoalsMap.toDomain(rawDb);
      const dto = GoalsMap.toDTO(goal);
      expect(dto.id).toBe('goal-uuid');
      expect(dto.description).toBe('Comprar carro');
      expect(typeof dto.amount).toBe('number');
      expect(typeof dto.amountTotal).toBe('number');
      expect(dto.percentage).toBe(1);
      expect(dto.monthYear).toBe(true);
    });

    it('deve incluir envelopeId no DTO', () => {
      const goal = GoalsMap.toDomain(rawDb);
      const dto = GoalsMap.toDTO(goal);
      expect(typeof dto.envelopeId).toBe('string');
    });
  });

  describe('toPersistence()', () => {
    it('deve mapear Goals para formato snake_case de banco', async () => {
      const goal = GoalsMap.toDomain(rawDb);
      const persistence = await GoalsMap.toPersistence(goal);
      expect(persistence.id).toBe('goal-uuid');
      expect(persistence.envelope_id).toBeDefined();
      expect(persistence.amount_total).toBe(50000);
      expect(persistence.description).toBe('Comprar carro');
      expect(persistence.deadline).toBe('10');
      expect(persistence.month_year).toBe(true);
    });
  });
});
