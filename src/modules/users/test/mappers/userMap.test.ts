import { describe, expect, test } from "@jest/globals";
import { UserMap } from "../../mappers/userMap";
import { User } from "../../domain/user";
import { UserEmail } from "../../domain/userEmail";
import { UserName } from "../../domain/userName";
import { UserPassword } from "../../domain/userPassword";
import { UserDTO } from "../../dtos/userDTO";

describe("UserMap", () => {
  describe("toDTO", () => {
    test("should User maper to UserDTO", () => {
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

      const userDto: UserDTO = UserMap.toDTO(userOrError.getValue());

      expect(userDto).toStrictEqual({
        username: "test",
        isEmailVerified: false,
        isAdminUser: false,
        isDeleted: false,
      });
    });
  });
  describe("toDomain", () => {
    test("should UserDTO maper to Domain", () => {
      const userDto: any = {
        username: "test",
        user_email: "test@test.com",
        user_password:
          "$2a$10$7hiC64opADPYTTwkX9oW5emuVWP9VtpxKXl35e0bwn6DEUKSgm/lG",
        isEmailVerified: false,
        isAdminUser: false,
        isDeleted: false,
      };

      const user: User = UserMap.toDomain(userDto);
      expect(user.id.toValue()).toMatch(/^[a-f0-9-]{36}$/);
      expect(user.email.value).toBe("test@test.com");
      expect(user.username.value).toBe("test");
      expect(user.password.value).toBe(
        "$2a$10$7hiC64opADPYTTwkX9oW5emuVWP9VtpxKXl35e0bwn6DEUKSgm/lG"
      );
    });

    test("should return null for userName is null", () => {
      const rawUser = {};
      const user = UserMap.toDomain(rawUser);

      expect(user).toBe(null);
    });
    test("should return null for user_password is null", () => {
      const rawUser = {
        username: "test",
      };
      const user = UserMap.toDomain(rawUser);

      expect(user).toBe(null);
    });
    test("should return null for user_email is null", () => {
      const rawUser = {
        username: "test",
        user_password:
          "$2a$10$7hiC64opADPYTTwkX9oW5emuVWP9VtpxKXl35e0bwn6DEUKSgm/lG",
      };
      const user = UserMap.toDomain(rawUser);

      expect(user).toBe(null);
    });
  });

  describe("toPersistence", () => {
    test("should correctly map a User object to persistence format", async () => {
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
      const persistenceData = await UserMap.toPersistence(
        userOrError.getValue()
      );

      expect(persistenceData).toStrictEqual({
        id: userOrError.getValue().userId.id.toString(),
        user_email: userOrError.getValue().email.value,
        is_email_verified: userOrError.getValue().isEmailVerified,
        username: userOrError.getValue().username.value,
        user_password: userOrError.getValue().password.value,
        is_admin_user: userOrError.getValue().isAdminUser,
        is_deleted: userOrError.getValue().isDeleted,
      });
    });

    test("should handle null password when mapping to persistence", async () => {
      const userNameOrError = UserName.create({ name: "bob" });

      const userEmailOrError = UserEmail.create("bob@example.com");

      const userOrError = User.create({
        username: userNameOrError.getValue(),
        password: null,
        email: userEmailOrError.getValue(),
      });

      const persistenceData = await UserMap.toPersistence(
        userOrError.getValue()
      );

      expect(persistenceData.user_password).toBe(null);
    });
  });
});
