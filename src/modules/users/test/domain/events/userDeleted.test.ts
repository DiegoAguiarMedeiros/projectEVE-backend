import { describe, expect, it } from "@jest/globals";
import { UserDeleted } from "../../../domain/events/userDeleted";
import { User } from "../../../domain/user";
import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";

describe("UserDeleted", () => {
  it("should create a UserDeleted event with correct properties", () => {
    // Arrange
    const userMock = {
      id: new UniqueEntityID(),
      /* other user properties */
    };

    // Act
    const event = new UserDeleted(userMock as User);

    // Assert
    expect(event.dateTimeOccurred).toBeInstanceOf(Date);
    expect(event.user).toBe(userMock);
  });

  it("should return the correct aggregate ID", () => {
    // Arrange
    const userId = new UniqueEntityID();
    const userMock = {
      id: userId,
      /* other user properties */
    };
    const event = new UserDeleted(userMock as User);

    // Act
    const aggregateId = event.getAggregateId();

    // Assert
    expect(aggregateId).toBe(userId);
  });
});
