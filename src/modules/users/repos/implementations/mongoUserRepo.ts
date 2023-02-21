import { IUserRepo } from "../userRepo";
import { UserName } from "../../domain/userName";
import { User } from "../../domain/user";
import { UserMap } from "../../mappers/userMap";
import { UserEmail } from "../../domain/userEmail";

export class MongoUserRepo implements IUserRepo {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async exists(userEmail: UserEmail): Promise<boolean> {
        const UserModel = this.models.userModel;
        const userModel = await UserModel.findOne({ user_email: userEmail.value });
        return !!userModel === true;
    }
    getUserByUserId(userId: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    async getUserByUserName(userName: string | UserName): Promise<User> {
        const UserModel = this.models.userModel;
        const baseUser = await UserModel.findOne({
            username: userName instanceof UserName
                ? (<UserName>userName).value
                : userName
        });
        if (!!baseUser === false) throw new Error("User not found.")
        return UserMap.toDomain(baseUser);
    }
    async save(user: User): Promise<void> {
        const UserModel = this.models.userModel;
        const exists = await this.exists(user.email);

        if (!exists) {
            const rawUser = await UserMap.toPersistence(user);
            await UserModel.create(rawUser);
        }

        return;
    }

}