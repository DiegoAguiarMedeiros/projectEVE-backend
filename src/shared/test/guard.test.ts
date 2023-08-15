import { describe, expect, test } from "@jest/globals";
import { Guard } from "../core/Guard";
import { Result } from "../core/Result";

describe("Guard", () => {
  describe("combine", () => {
    test("should return a successful result if all guardResults are successful", () => {
      const guardResults: Result<any>[] = [
        Result.ok(),
        Result.ok(),
        Result.ok(),
      ];

      const combinedResult = Guard.combine(guardResults);

      expect(combinedResult.isSuccess).toBe(true);
      expect(combinedResult.isFailure).toBe(false);
    });

    test("should return the first failure result if at least one guardResult is a failure", () => {
      const failureResult = Result.fail("Some error message");
      const guardResults: Result<any>[] = [
        Result.ok(),
        failureResult,
        Result.ok(),
      ];

      const combinedResult = Guard.combine(guardResults);

      expect(combinedResult.isFailure).toBe(true);
      expect(combinedResult.error).toBe(failureResult.error);
    });

    test("should return a successful result if guardResults array is empty", () => {
      const guardResults: Result<any>[] = [];

      const combinedResult = Guard.combine(guardResults);

      expect(combinedResult.isSuccess).toBe(true);
      expect(combinedResult.isFailure).toBe(false);
    });
  });

  describe("greaterThan", () => {
    test("should return a successful result if actualValue is greater than minValue", () => {
      const minValue = 5;
      const actualValue = 10;

      const validationResult = Guard.greaterThan(minValue, actualValue);

      expect(validationResult.isSuccess).toBe(true);
      expect(validationResult.isFailure).toBe(false);
    });

    test("should return a failure result if actualValue is equal to minValue", () => {
      const minValue = 5;
      const actualValue = 5;

      const validationResult = Guard.greaterThan(minValue, actualValue);

      expect(validationResult.isFailure).toBe(true);
      expect(validationResult.error).toBe(
        `Number given {${actualValue}} is not greater than {${minValue}}`
      );
    });

    test("should return a failure result if actualValue is less than minValue", () => {
      const minValue = 10;
      const actualValue = 5;

      const validationResult = Guard.greaterThan(minValue, actualValue);
      console.log("validationResult", validationResult);
      expect(validationResult.isFailure).toBe(true);
      expect(validationResult.error).toBe(
        `Number given {${actualValue}} is not greater than {${minValue}}`
      );
    });
  });

  describe("againstAtLeast", () => {
    test("should return a successful result if text length is greater than or equal to numChars", () => {
      const numChars = 5;
      const text = "Hello, World!";

      const validationResult = Guard.againstAtLeast(numChars, text);

      expect(validationResult.isSuccess).toBe(true);
      expect(validationResult.isFailure).toBe(false);
    });

    test("should return a failure result if text length is less than numChars", () => {
      const numChars = 10;
      const text = "Hello";

      const validationResult = Guard.againstAtLeast(numChars, text);

      expect(validationResult.isFailure).toBe(true);
      expect(validationResult.error).toBe(
        `Text is not at least ${numChars} chars.`
      );
    });

    test("should return a successful result if text length is equal to numChars", () => {
      const numChars = 7;
      const text = "Testing";

      const validationResult = Guard.againstAtLeast(numChars, text);

      expect(validationResult.isSuccess).toBe(true);
      expect(validationResult.isFailure).toBe(false);
    });
  });
  describe("againstAtMost", () => {
    test("should return a successful result if text length is less than or equal to numChars", () => {
      const numChars = 15;
      const text = "Hello, World!";

      const validationResult = Guard.againstAtMost(numChars, text);
      expect(validationResult.isSuccess).toBe(true);
      expect(validationResult.isFailure).toBe(false);
    });

    test("should return a failure result if text length is greater than numChars", () => {
      const numChars = 5;
      const text = "This is a longer text.";

      const validationResult = Guard.againstAtMost(numChars, text);

      expect(validationResult.isFailure).toBe(true);
      expect(validationResult.error).toBe(
        `Text is greater than ${numChars} chars.`
      );
    });

    test("should return a successful result if text length is equal to numChars", () => {
      const numChars = 7;
      const text = "Testing";

      const validationResult = Guard.againstAtMost(numChars, text);

      expect(validationResult.isSuccess).toBe(true);
      expect(validationResult.isFailure).toBe(false);
    });
  });

  describe("againstNullOrUndefined", () => {
    test("should return a failure result if the argument is null", () => {
      const argument = null;
      const argumentName = "myArgument";

      const validationResult = Guard.againstNullOrUndefined(
        argument,
        argumentName
      );

      expect(validationResult.isFailure).toBe(true);
      expect(validationResult.error).toBe(
        `${argumentName} is null or undefined`
      );
    });

    test("should return a failure result if the argument is undefined", () => {
      const argument = undefined;
      const argumentName = "myArgument";

      const validationResult = Guard.againstNullOrUndefined(
        argument,
        argumentName
      );

      expect(validationResult.isFailure).toBe(true);
      expect(validationResult.error).toBe(
        `${argumentName} is null or undefined`
      );
    });

    test("should return a successful result if the argument is not null or undefined", () => {
      const argument = "someValue";
      const argumentName = "myArgument";

      const validationResult = Guard.againstNullOrUndefined(
        argument,
        argumentName
      );

      expect(validationResult.isSuccess).toBe(true);
      expect(validationResult.isFailure).toBe(false);
    });
  });

  describe("isOneOf", () => {
    test("should return a successful result if value is one of the valid values", () => {
      const value = "apple";
      const validValues = ["apple", "banana", "orange"];
      const argumentName = "myValue";

      const validationResult = Guard.isOneOf(value, validValues, argumentName);

      expect(validationResult.isSuccess).toBe(true);
      expect(validationResult.isFailure).toBe(false);
    });

    test("should return a failure result if value is not one of the valid values", () => {
      const value = "grape";
      const validValues = ["apple", "banana", "orange"];
      const argumentName = "myValue";

      const validationResult = Guard.isOneOf(value, validValues, argumentName);

      expect(validationResult.isFailure).toBe(true);
      expect(validationResult.error).toBe(
        `${argumentName} isn't oneOf the correct types in ${JSON.stringify(
          validValues
        )}. Got "${value}".`
      );
    });

    describe("inRange", () => {
      test("should return a successful result if num is within the range", () => {
        const num = 5;
        const min = 1;
        const max = 10;
        const argumentName = "myNum";

        const validationResult = Guard.inRange(num, min, max, argumentName);

        expect(validationResult.isSuccess).toBe(true);
        expect(validationResult.isFailure).toBe(false);
      });

      test("should return a failure result if num is below the range", () => {
        const num = -5;
        const min = 1;
        const max = 10;
        const argumentName = "myNum";

        const validationResult = Guard.inRange(num, min, max, argumentName);

        expect(validationResult.isFailure).toBe(true);
        expect(validationResult.error).toBe(
          `${argumentName} is not within range ${min} to ${max}.`
        );
      });

      test("should return a failure result if num is above the range", () => {
        const num = 15;
        const min = 1;
        const max = 10;
        const argumentName = "myNum";

        const validationResult = Guard.inRange(num, min, max, argumentName);

        expect(validationResult.isFailure).toBe(true);
        expect(validationResult.error).toBe(
          `${argumentName} is not within range ${min} to ${max}.`
        );
      });

      test("should return a successful result if num is at the lower bound of the range", () => {
        const num = 1;
        const min = 1;
        const max = 10;
        const argumentName = "myNum";

        const validationResult = Guard.inRange(num, min, max, argumentName);

        expect(validationResult.isSuccess).toBe(true);
        expect(validationResult.isFailure).toBe(false);
      });

      test("should return a successful result if num is at the upper bound of the range", () => {
        const num = 10;
        const min = 1;
        const max = 10;
        const argumentName = "myNum";

        const validationResult = Guard.inRange(num, min, max, argumentName);

        expect(validationResult.isSuccess).toBe(true);
        expect(validationResult.isFailure).toBe(false);
      });
    });
  });
  describe("allInRange", () => {
    test("should return a successful result if all numbers are within the range", () => {
      const numbers = [5, 8, 2, 7];
      const min = 1;
      const max = 10;
      const argumentName = "myNumbers";

      const validationResult = Guard.allInRange(
        numbers,
        min,
        max,
        argumentName
      );
      expect(validationResult.isSuccess).toBe(true);
      expect(validationResult.isFailure).toBe(false);
    });

    test("should return a failure result if at least one number is outside the range", () => {
      const numbers = [5, 15, 2, 7];
      const min = 1;
      const max = 10;
      const argumentName = "myNumbers";

      const validationResult = Guard.allInRange(
        numbers,
        min,
        max,
        argumentName
      );

      expect(validationResult.isFailure).toBe(true);
      expect(validationResult.error).toBe(
        `${argumentName} is not within the range.`
      );
    });

    test("should return a successful result if all numbers are at the lower bound of the range", () => {
      const numbers = [1, 1, 1, 1];
      const min = 1;
      const max = 10;
      const argumentName = "myNumbers";

      const validationResult = Guard.allInRange(
        numbers,
        min,
        max,
        argumentName
      );

      expect(validationResult.isSuccess).toBe(true);
      expect(validationResult.isFailure).toBe(false);
    });

    test("should return a successful result if all numbers are at the upper bound of the range", () => {
      const numbers = [10, 10, 10, 10];
      const min = 1;
      const max = 10;
      const argumentName = "myNumbers";

      const validationResult = Guard.allInRange(
        numbers,
        min,
        max,
        argumentName
      );
      expect(validationResult.isSuccess).toBe(true);
      expect(validationResult.isFailure).toBe(false);
    });
  });
});
