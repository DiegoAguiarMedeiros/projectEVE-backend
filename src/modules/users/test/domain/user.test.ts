import { describe, expect, test, it } from "@jest/globals";
import { User } from "../../domain/user";
import { Name } from "../../domain/name";
import { Password } from "../../domain/password";
import { Email } from "../../domain/email";

describe("User", () => {
  const validUserProps = {
    email: Email.create("test@example.com").getValue(),
    name: Name.create({ name: "testuser" }).getValue(),
    password: Password.create({
      value: "12345678",
      hashed: true,
    }).getValue(),
  };
  test("should create user", () => {
    const userOrError = User.create(validUserProps);
    expect(userOrError.isSuccess).toBe(true);
  });

  it("should create a new User with default properties if not provided", () => {
    // Act
    const userResult = User.create(validUserProps);

    // Assert
    expect(userResult.isSuccess).toBe(true);
    const user = userResult.getValue();
    expect(user.isDeleted).toBe(false);
    expect(user.isEmailVerified).toBe(false);
    expect(user.isAdminUser).toBe(false);
  });
});

describe("Email", () => {
  test("should give error: Email address not valid", () => {
    const EmailOrError = Email.create("test@testcom");
    expect(EmailOrError.getErrorValue()).toBe("Email address not valid");
  });
  test("should return Email", () => {
    const NameOrError = Email.create("test@test.com");
    expect(NameOrError.getValue().props.value).toBe("test@test.com");
  });
});
describe("Name", () => {
  test("should give error: Text is not at least 2 chars", () => {
    const NameOrError = Name.create({ name: "t" });
    expect(NameOrError.getErrorValue()).toBe(
      "Text is not at least 2 chars."
    );
  });
  test("should return Name", () => {
    const NameOrError = Name.create({ name: "test" });
    expect(NameOrError.getValue().props.name).toBe("test");
  });
  test("should give error: Text is greater than 15 chars", () => {
    const NameOrError = Name.create({ name: "qwertyuiopasdfgs" });
    expect(NameOrError.getErrorValue()).toBe(
      "Text is greater than 15 chars."
    );
  });
});
describe("Password", () => {
  test("should give error: Password doesnt meet criteria [8 chars min]", () => {
    const PasswordOrError = Password.create({ value: "a" });
    expect(PasswordOrError.getErrorValue()).toBe(
      "Password doesnt meet criteria [8 chars min]."
    );
  });
  test("should return Password", () => {
    const PasswordOrError = Password.create({ value: "12345678" });
    expect(PasswordOrError.getValue().props.value).toBe("12345678");
  });
  test("should return true on comparePassword", async () => {
    const PasswordOrError = Password.create({ value: "12345678" });
    expect(
      await PasswordOrError.getValue().comparePassword("12345678")
    ).toBe(true);
  });
  test("should return false on comparePassword", async () => {
    const PasswordOrError = Password.create({ value: "12345678" });
    expect(
      await PasswordOrError.getValue().comparePassword("1234567")
    ).toBe(false);
  });

  test("should return false on isAlreadyHashed", async () => {
    const PasswordOrError = Password.create({ value: "12345678" });
    expect(await PasswordOrError.getValue().isAlreadyHashed()).toBe(false);
  });
  test("should return true on isAlreadyHashed", async () => {
    const PasswordOrError = Password.create({
      value: "$2a$10$EG6GoDWFEz6wF95O0gC2BuwhaHAZggT12HPR0jiuyN/gjKcpmQS4i",
      hashed: true,
    });
    expect(await PasswordOrError.getValue().isAlreadyHashed()).toBe(true);
  });
  test("should return hash of password", async () => {
    const PasswordOrError = Password.create({ value: "12345678" });
    expect(await PasswordOrError.getValue().getHashedValue()).toMatch(
      /^\$2[ayb]\$.{56}$/
    );
  });
});
