import { describe, expect, test } from "@jest/globals";
import { UserMap } from "../../mappers/userMap";
import { User } from "../../domain/user";
import { UserEmail } from "../../domain/userEmail";
import { UserName } from "../../domain/userName";
import { UserPassword } from "../../domain/userPassword";
import { UserDTO } from "../../dtos/userDTO";

describe("UserMap", () => {
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
});
