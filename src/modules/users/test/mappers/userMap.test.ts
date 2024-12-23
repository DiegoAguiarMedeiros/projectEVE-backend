import { describe, expect, test } from "@jest/globals";
import { UserMap } from "../../mappers/userMap";
import { User } from "../../domain/user";
import { Email } from "../../domain/email";
import { Name } from "../../domain/name";
import { Password } from "../../domain/password";
import { UserDTO } from "../../dtos/userDTO";

describe("UserMap", () => {
  describe("toDTO", () => {
    test("should User maper to UserDTO", () => {
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

      const userDto: UserDTO = UserMap.toDTO(userOrError.getValue());

      expect(userDto).toStrictEqual({
        name: "test",
        isEmailVerified: false,
        isAdminUser: false,
        isDeleted: false,
      });
    });
  });
  describe("toDomain", () => {

    test("should UserDTO maper to Domain", () => {
      const userDto: any = {
        name: "test",
        email: "test@test.com",
        password:
          "$2a$10$7hiC64opADPYTTwkX9oW5emuVWP9VtpxKXl35e0bwn6DEUKSgm/lG",
        isEmailVerified: false,
        isAdminUser: false,
        isDeleted: false,
      };

      const user: User = UserMap.toDomain(userDto);

      expect(user.id.toValue()).toMatch(/^[a-f0-9-]{36}$/);
      expect(user.email.value).toBe("test@test.com");
      expect(user.name.value).toBe("test");
      expect(user.password.value).toBe(
        "$2a$10$7hiC64opADPYTTwkX9oW5emuVWP9VtpxKXl35e0bwn6DEUKSgm/lG"
      );
    });

    test("should return null for Name is null", () => {
      const rawUser = {};
      expect(() => {
        UserMap.toDomain(rawUser);
      }).toThrow('Invalid use name');
    });

    test("should return null for password is null", () => {
      const rawUser = {
        name: "test",
      };
      expect(() => {
        UserMap.toDomain(rawUser);
      }).toThrow('Invalid user password');
    });

    test("should return null for email is null", () => {
      const rawUser = {
        name: "test",
        password:
          "$2a$10$7hiC64opADPYTTwkX9oW5emuVWP9VtpxKXl35e0bwn6DEUKSgm/lG",
      };

      expect(() => {
        UserMap.toDomain(rawUser);
      }).toThrow('Invalid user email');
    });
  });

  describe("toPersistence", () => {
    test("should correctly map a User object to persistence format", async () => {
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
      const persistenceData = await UserMap.toPersistence(
        userOrError.getValue()
      );

      expect(persistenceData).toStrictEqual({
        id: userOrError.getValue().id.toString(),
        email: userOrError.getValue().email.value,
        is_email_verified: userOrError.getValue().isEmailVerified,
        name: userOrError.getValue().name.value,
        password: userOrError.getValue().password.value,
        is_admin_user: userOrError.getValue().isAdminUser,
        is_deleted: userOrError.getValue().isDeleted,
      });
    });

    test("should handle null password when mapping to persistence", async () => {
      const NameOrError = Name.create({ name: "bob" });

      const EmailOrError = Email.create("bob@example.com");

      const userOrError = User.create({
        name: NameOrError.getValue(),
        // @ts-ignore
        password: null,
        email: EmailOrError.getValue(),
      });
      const persistenceData = await UserMap.toPersistence(
        userOrError.getValue()
      );
      expect(persistenceData.password).toBe('');
    });
  });
});
