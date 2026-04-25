import { Envelopes } from '../Envelopes';
import { Balance } from '../../../../shared/domain/Balance';
import { Color } from '../../../../shared/domain/Color';
import { Id } from '../../../../shared/domain/Id';
import { Name } from '../../../../shared/domain/Name';
import { Percentage } from '../../../../shared/domain/Percentage';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

const makeValidProps = () => ({
  name: Name.create({ name: 'Alimentação' }).getValue(),
  color: Color.create({ color: '#ff5733' }).getValue(),
  percentage: Percentage.create({ percentage: 30 }).getValue(),
  userId: Id.create(new UniqueEntityID('user-uuid')).getValue(),
  order: Balance.create({ balance: 1 }).getValue(),
});

describe('Envelopes', () => {
  describe('create()', () => {
    it('deve criar Envelopes com props obrigatórios válidos', () => {
      const result = Envelopes.create(makeValidProps());
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Envelopes);
    });

    it('deve criar Envelopes com props opcionais (amount e used)', () => {
      const result = Envelopes.create({
        ...makeValidProps(),
        amount: Balance.create({ balance: 1500 }).getValue(),
        used: Percentage.create({ percentage: 50 }).getValue(),
      });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().amount!.value).toBe(1500);
      expect(result.getValue().used!.value).toBe(50);
    });

    it('deve preservar o id fornecido', () => {
      const id = new UniqueEntityID('env-uuid');
      const envelope = Envelopes.create(makeValidProps(), id).getValue();
      expect(envelope.id.toString()).toBe('env-uuid');
    });

    it('deve falhar quando name é null', () => {
      const result = Envelopes.create({ ...makeValidProps(), name: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando userId é null', () => {
      const result = Envelopes.create({ ...makeValidProps(), userId: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando color é null', () => {
      const result = Envelopes.create({ ...makeValidProps(), color: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando order é null', () => {
      const result = Envelopes.create({ ...makeValidProps(), order: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('amount deve ser undefined por padrão', () => {
      const envelope = Envelopes.create(makeValidProps()).getValue();
      expect(envelope.amount).toBeUndefined();
    });
  });

  describe('getters e mutators', () => {
    it('deve atualizar name via updateName()', () => {
      const envelope = Envelopes.create(makeValidProps()).getValue();
      const newName = Name.create({ name: 'Transporte' }).getValue();
      envelope.updateName(newName);
      expect(envelope.name.value).toBe('Transporte');
    });

    it('deve atualizar color via updateColor()', () => {
      const envelope = Envelopes.create(makeValidProps()).getValue();
      const newColor = Color.create({ color: '#000000' }).getValue();
      envelope.updateColor(newColor);
      expect(envelope.color.value).toBe('#000000');
    });

    it('deve atualizar percentage via updatePercentage()', () => {
      const envelope = Envelopes.create(makeValidProps()).getValue();
      const newPercentage = Percentage.create({ percentage: 40 }).getValue();
      envelope.updatePercentage(newPercentage);
      expect(envelope.percentage.value).toBe(40);
    });

    it('deve atualizar used via updateUsed()', () => {
      const envelope = Envelopes.create(makeValidProps()).getValue();
      const used = Percentage.create({ percentage: 60 }).getValue();
      envelope.updateUsed(used);
      expect(envelope.used!.value).toBe(60);
    });
  });
});
