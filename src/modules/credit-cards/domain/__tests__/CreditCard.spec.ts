import { CreditCard } from '../CreditCard';
import { Flag } from '../Flag';
import { Id } from '../../../../shared/domain/Id';
import { Name } from '../../../../shared/domain/Name';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

const makeValidProps = () => ({
  name: Name.create({ name: 'Nubank' }).getValue(),
  flag: Flag.create({ flag: 'Visa' }).getValue(),
  active: true,
  userId: Id.create(new UniqueEntityID('user-uuid')).getValue(),
});

describe('CreditCard', () => {
  describe('create()', () => {
    it('deve criar CreditCard com props válidos', () => {
      const result = CreditCard.create(makeValidProps());
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(CreditCard);
    });

    it('deve preservar o id fornecido', () => {
      const id = new UniqueEntityID('cc-uuid');
      const cc = CreditCard.create(makeValidProps(), id).getValue();
      expect(cc.id.toString()).toBe('cc-uuid');
    });

    it('deve falhar quando name é null', () => {
      const result = CreditCard.create({ ...makeValidProps(), name: null as any });
      expect(result.isFailure).toBe(true);
    });

    it('deve falhar quando userId é null', () => {
      const result = CreditCard.create({ ...makeValidProps(), userId: null as any });
      expect(result.isFailure).toBe(true);
    });
  });

  describe('getters e mutators', () => {
    it('deve retornar active correto', () => {
      const cc = CreditCard.create(makeValidProps()).getValue();
      expect(cc.active).toBe(true);
    });

    it('deve retornar flag correto', () => {
      const cc = CreditCard.create(makeValidProps()).getValue();
      expect(cc.flag.value).toBe('Visa');
    });

    it('deve atualizar name via updateName()', () => {
      const cc = CreditCard.create(makeValidProps()).getValue();
      const newName = Name.create({ name: 'Itaú' }).getValue();
      cc.updateName(newName);
      expect(cc.name.value).toBe('Itaú');
    });

    it('deve atualizar flag via updateFlag()', () => {
      const cc = CreditCard.create(makeValidProps()).getValue();
      const newFlag = Flag.create({ flag: 'Mastercard' }).getValue();
      cc.updateFlag(newFlag);
      expect(cc.flag.value).toBe('Mastercard');
    });
  });
});

describe('Flag', () => {
  describe('create()', () => {
    it('deve criar Flag com bandeira válida', () => {
      const result = Flag.create({ flag: 'Visa' });
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('Visa');
    });

    it('deve criar com todas as bandeiras válidas', () => {
      const flags = ['Visa', 'Mastercard', 'Elo', 'Hipercard', 'American Express', 'Diners Club'] as const;
      for (const flag of flags) {
        expect(Flag.create({ flag }).isSuccess).toBe(true);
      }
    });

    it('deve falhar com bandeira inválida', () => {
      const result = Flag.create({ flag: 'UnknownFlag' as any });
      expect(result.isFailure).toBe(true);
    });
  });
});
