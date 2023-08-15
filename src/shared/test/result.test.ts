import { describe, expect, test } from "@jest/globals";
import { Guard } from "../core/Guard";
import { Left, Result, Right } from "../core/Result";

describe("Result", () => {
  describe("getValue", () => {
    test("should throw an error when trying to get the value of an error result", () => {
      const errorResult = Result.fail<number>("Something went wrong");

      expect(() => errorResult.getValue()).toThrowError(
        "Can't get the value of an error result. Use 'errorValue' instead."
      );
    });

    test("should return the value when getting the value of a successful result", () => {
      const successResult = Result.ok<number>(42);

      const value = successResult.getValue();

      expect(value).toBe(42);
    });
  });

  describe("getErrorValue", () => {
    test("should return the error value of an error result", () => {
      const errorResult = Result.fail<number>("Something went wrong");

      const errorValue = errorResult.getErrorValue();

      expect(errorValue).toBe("Something went wrong");
    });

    test("should return null when getting the error value of a successful result", () => {
      const successResult = Result.ok<number>(42);

      const errorValue = successResult.getErrorValue();

      expect(errorValue).toBe(null);
    });
  });

  describe("ok", () => {
    test("should create a successful result with the given value", () => {
      const successResult = Result.ok<number>(42);

      expect(successResult.isSuccess).toBe(true);
      expect(successResult.isFailure).toBe(false);
      expect(successResult.getValue()).toBe(42);
    });
  });

  describe("fail", () => {
    test("should create an error result with the given error message", () => {
      const errorResult = Result.fail<number>("Something went wrong");

      expect(errorResult.isFailure).toBe(true);
      expect(errorResult.isSuccess).toBe(false);
      expect(errorResult.getErrorValue()).toBe("Something went wrong");
    });
  });

  describe("combine", () => {
    test("should return the first failure result if at least one result is a failure", () => {
      const successResult = Result.ok<number>(42);
      const errorResult = Result.fail<number>("Something went wrong");
      const results = [successResult, errorResult];

      const combinedResult = Result.combine(results);

      expect(combinedResult.isFailure).toBe(true);
      expect(combinedResult.error).toBe("Something went wrong");
    });

    test("should return a successful result if all results are successful", () => {
      const successResult1 = Result.ok<number>(42);
      const successResult2 = Result.ok<number>(100);
      const results = [successResult1, successResult2];

      const combinedResult = Result.combine(results);

      expect(combinedResult.isSuccess).toBe(true);
      expect(combinedResult.isFailure).toBe(false);
    });

    test("should return a successful result when combining an empty array of results", () => {
      const results: Result<any>[] = [];

      const combinedResult = Result.combine(results);

      expect(combinedResult.isSuccess).toBe(true);
      expect(combinedResult.isFailure).toBe(false);
    });
  });

  describe("Left", () => {
    describe("isLeft", () => {
      test("should return true for a Left instance", () => {
        const leftInstance = new Left<string, number>("Error message");

        expect(leftInstance.isLeft()).toBe(true);
      });

      test("should return false for a Right instance", () => {
        // This test assumes you have a Right class defined.
        // You can adapt this test accordingly to your codebase.
        const rightInstance = new Right<string, number>(42);

        expect(rightInstance.isLeft()).toBe(false);
      });
    });

    describe("isRight", () => {
      test("should return false for a Left instance", () => {
        const leftInstance = new Left<string, number>("Error message");

        expect(leftInstance.isRight()).toBe(false);
      });

      test("should return true for a Right instance", () => {
        // This test assumes you have a Right class defined.
        // You can adapt this test accordingly to your codebase.
        const rightInstance = new Right<string, number>(42);

        expect(rightInstance.isRight()).toBe(true);
      });
    });
  });

  describe("Right", () => {
    describe("isLeft", () => {
      test("should return false for a Right instance", () => {
        const rightInstance = new Right<string, number>(42);

        expect(rightInstance.isLeft()).toBe(false);
      });

      test("should return true for a Left instance", () => {
        // This test assumes you have a Left class defined.
        // You can adapt this test accordingly to your codebase.
        const leftInstance = new Left<string, number>("Error message");

        expect(leftInstance.isLeft()).toBe(true);
      });
    });

    describe("isRight", () => {
        test("should return true for a Right instance", () => {
        const rightInstance = new Right<string, number>(42);

        expect(rightInstance.isRight()).toBe(true);
      });

      test("should return false for a Left instance", () => {
        // This test assumes you have a Left class defined.
        // You can adapt this test accordingly to your codebase.
        const leftInstance = new Left<string, number>("Error message");

        expect(leftInstance.isRight()).toBe(false);
      });
    });
  });
});
