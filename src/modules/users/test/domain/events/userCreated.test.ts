import { beforeAll, describe, expect, it } from "@jest/globals";
import { UserCreated } from "../../../domain/events/userCreated";
import { User } from "../../../domain/user";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Name } from "../../../domain/name";
import { Password } from "../../../domain/password";
import { Email } from "../../../domain/email";

describe("UserCreated", () => {
  const NameOrError = Name.create({ name: "test" });
  const PasswordOrError = Password.create({
    value: "1234",
    hashed: true,
  });
  const EmailOrError = Email.create("test@test.com");

  const userOrError = User.create({
    name: NameOrError.getValue(),
    password: PasswordOrError.getValue(),
    email: EmailOrError.getValue(),
  });

  it("should create a UserCreated event with correct properties", () => {
    // Arrange

    // // Act
    const event = new UserCreated(userOrError.getValue());

    // // Assert
    expect(event.dateTimeOccurred).toBeInstanceOf(Date);
    expect(event.user).toBe(userOrError.getValue());
  });

  it("should return the correct aggregate ID", () => {
    // Arrange
    const event = new UserCreated(userOrError.getValue());

    // Act
    const aggregateId = event.getAggregateId();

    // Assert
    expect(aggregateId.toValue()).toMatch(/^[a-f0-9-]{36}$/);
  });
});
