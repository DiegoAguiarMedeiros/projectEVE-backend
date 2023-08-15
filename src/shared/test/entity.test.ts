import { describe, expect, test } from "@jest/globals";
import { Entity } from "../domain/Entity"; // Import the Entity class
import { UniqueEntityID } from "../domain/UniqueEntityID";

class TestEntity extends Entity<{ prop: string }> {
  
}


// Mock isEntity function for testing purposes
function isEntity(obj: any): boolean {
  return true; // Replace with actual implementation
}

describe("Entity", () => {
  describe("equals", () => {
    test("should return true when comparing the same instance", () => {
      const id = new UniqueEntityID();
      const entity = new TestEntity({ prop: "value" }, id);

      const isEqual = entity.equals(entity);

      expect(isEqual).toBe(true);
    });

    test("should return false when comparing with null or undefined", () => {
      const entity = new TestEntity({ prop: "value" });

      const isEqualNull = entity.equals(null);
      const isEqualUndefined = entity.equals();

      expect(isEqualNull).toBe(false);
      expect(isEqualUndefined).toBe(false);
    });

    test("should return false when comparing with a non-entity object", () => {
      const entity = new TestEntity({ prop: "value" });

      const isEqualNonEntity = entity.equals({});

      expect(isEqualNonEntity).toBe(false);
    });

    test("should return true when comparing with an entity with the same ID", () => {
      const id1 = new UniqueEntityID();
      const id2 = new UniqueEntityID();
      const entity1 = new TestEntity({ prop: "value" }, id1);
      const entity2 = new TestEntity({ prop: "value" }, id1);
      const entity3 = new TestEntity({ prop: "value" }, id2);

      const isEqual1 = entity1.equals(entity2);
      const isEqual2 = entity1.equals(entity3);

      expect(isEqual1).toBe(true);
      expect(isEqual2).toBe(false);
    });
  });
});
