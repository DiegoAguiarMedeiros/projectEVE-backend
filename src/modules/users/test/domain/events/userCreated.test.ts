import { beforeAll, describe, expect, it } from "@jest/globals";
import { UserCreated } from "../../../domain/events/userCreated";
import { User } from "../../../domain/user";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { UserName } from "../../../domain/userName";
import { UserPassword } from "../../../domain/userPassword";
import { UserEmail } from "../../../domain/userEmail";

describe("UserCreated", () => {
  const userNameOrError = UserName.create({ name: "test" });
  const userPasswordOrError = UserPassword.create({
    value: "1234",
    hashed: true,
  });
  const userEmailOrError = UserEmail.create("test@test.com");

  const userOrError = User.create({
    username: userNameOrError.getValue(),
    password: userPasswordOrError.getValue(),
    email: userEmailOrError.getValue(),
  });

  it("should create a UserCreated event with correct properties", () => {
    // Arrange

    // // Act
    const event = new UserCreated(userOrError.getValue());

    console.log('event',event.user.username.value)

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
