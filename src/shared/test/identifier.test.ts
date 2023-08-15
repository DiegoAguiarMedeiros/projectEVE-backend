import { describe, expect, test } from "@jest/globals";
import { Identifier } from "../domain/Identifier";


describe("Identifier", () => {
  describe("equals", () => {
    test("should return false when comparing with null or undefined", () => {
      const identifier = new Identifier<number>(42);

      const isEqualNull = identifier.equals(null);
      const isEqualUndefined = identifier.equals(undefined);

      expect(isEqualNull).toBe(false);
      expect(isEqualUndefined).toBe(false);
    });

    test("should return true when comparing with an identifier of the same class and value", () => {
      const identifier1 = new Identifier<number>(42);
      const identifier2 = new Identifier<number>(42);

      const isEqual = identifier1.equals(identifier2);

      expect(isEqual).toBe(true);
    });

    test("should return false when comparing with an identifier of the same class but different value", () => {
      const identifier1 = new Identifier<number>(42);
      const identifier2 = new Identifier<number>(99);

      const isEqual = identifier1.equals(identifier2);

      expect(isEqual).toBe(false);
    });
  });

  describe("toString", () => {
    test("should return the string representation of the value", () => {
      const identifier = new Identifier<string>("test");

      const stringValue = identifier.toString();

      expect(stringValue).toBe("test");
    });
  });

  describe("toValue", () => {
    test("should return the raw value of the identifier", () => {
      const identifier = new Identifier<number>(42);

      const value = identifier.toValue();

      expect(value).toBe(42);
    });
  });
});
