import { Id } from '../Id';
import { UniqueEntityID } from '../UniqueEntityID';

describe('Id', () => {
  describe('create()', () => {
    it('deve criar sem argumento gerando um UUID automático', () => {
      const result = Id.create();
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Id);
    });

    it('deve criar com UniqueEntityID fornecido', () => {
      const uid = new UniqueEntityID('fixed-uuid');
      const result = Id.create(uid);
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().id.toString()).toBe('fixed-uuid');
    });

    it('deve preservar o id fornecido no getter .id', () => {
      const uid = new UniqueEntityID('abc-123');
      const id = Id.create(uid).getValue();
      expect(id.id.toString()).toBe('abc-123');
    });

    it('deve gerar ids únicos quando chamado sem argumento', () => {
      const a = Id.create().getValue();
      const b = Id.create().getValue();
      expect(a.id.toString()).not.toBe(b.id.toString());
    });
  });
});
