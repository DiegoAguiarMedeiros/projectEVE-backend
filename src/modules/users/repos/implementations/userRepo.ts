
import { IUserRepo } from "../userRepo";
import { Name } from "../../domain/name";
import { User } from "../../domain/user";
import { UserMap } from "../../mappers/userMap";
import { Email } from "../../domain/email";

export class UserRepo implements IUserRepo {
    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async exists(email: Email): Promise<boolean> {
        const userModel = this.models.User;
        const user = await userModel.findOne({
            where: {
                email: email.value
            }
        });
        return !!user === true;
    }

    async getUserByEmail(email: Email): Promise<User> {
        const userModel = this.models.User;
        const user = await userModel.findOne({
            where: {
                email: email.value
            }
        });
        if (!!user === false) throw new Error("User not found.")
        return UserMap.toDomain(user);
    }

    async getUserByUserId(userId: string): Promise<User> {
        const userModel = this.models.User;
        const user = await userModel.findOne({
            where: {
                base_user_id: userId
            }
        });
        if (!!user === false) throw new Error("User not found.")
        return UserMap.toDomain(user);
    }

    async save(user: User): Promise<void> {
        const UserModel = this.models.User;
        const exists = await this.exists(user.email);

        if (!exists) {
            const rawUser = await UserMap.toPersistence(user);
            await UserModel.create(rawUser);
        }

        return;
    }
}