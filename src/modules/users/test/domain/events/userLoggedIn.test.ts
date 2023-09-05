import { describe, expect, it } from "@jest/globals";
import { UserLoggedIn } from '../../../domain/events/userLoggedIn';
import { User } from '../../../domain/user';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

describe('UserLoggedIn', () => {
  it('should create a UserLoggedIn event with correct properties', () => {
    // Arrange
    const userMock = {
      id: new UniqueEntityID(),
      /* other user properties */
    };

    // Act
    const event = new UserLoggedIn(userMock as User);

    // Assert
    expect(event.dateTimeOccurred).toBeInstanceOf(Date);
    expect(event.user).toBe(userMock);
  });

  it('should return the correct aggregate ID', () => {
    // Arrange
    const userId = new UniqueEntityID();
    const userMock = {
      id: userId,
      /* other user properties */
    };
    const event = new UserLoggedIn(userMock as User);

    // Act
    const aggregateId = event.getAggregateId();

    // Assert
    expect(aggregateId).toBe(userId);
  });
});