import { describe, expect, test } from "@jest/globals";
import { ValueObject } from "../domain/ValueObject"; // Import the ValueObject class

interface TestProps {
  prop1: string;
  prop2: number;
}

// Concrete subclass for testing
class TestValueObject extends ValueObject<TestProps> {
  constructor(props: TestProps) {
    super(props);
  }
}

describe("ValueObject", () => {
  describe("equals", () => {
    test("should return false when comparing with null or undefined", () => {
      const valueObject = new TestValueObject({ prop1: "value", prop2: 42 });

      const isEqualNull = valueObject.equals(null);
      const isEqualUndefined = valueObject.equals();

      expect(isEqualNull).toBe(false);
      expect(isEqualUndefined).toBe(false);
    });

    test("should return false when comparing with a value object with undefined props", () => {
      const valueObject1 = new TestValueObject({ prop1: "value", prop2: 42 });
      const valueObject2 = new TestValueObject({} as TestProps);

      const isEqual = valueObject1.equals(valueObject2);

      expect(isEqual).toBe(false);
    });

    test("should return true when comparing with a value object with the same props", () => {
      const valueObject1 = new TestValueObject({ prop1: "value", prop2: 42 });
      const valueObject2 = new TestValueObject({ prop1: "value", prop2: 42 });

      const isEqual = valueObject1.equals(valueObject2);

      expect(isEqual).toBe(true);
    });

    test("should return false when comparing with a value object with different props", () => {
      const valueObject1 = new TestValueObject({ prop1: "value", prop2: 42 });
      const valueObject2 = new TestValueObject({
        prop1: "new value",
        prop2: 99,
      });

      const isEqual = valueObject1.equals(valueObject2);

      expect(isEqual).toBe(false);
    });
  });
});
