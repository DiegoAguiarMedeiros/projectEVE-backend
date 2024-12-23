import { IUserRepo } from "../userRepo";
import { User } from "../../domain/user";
import { UserMap } from "../../mappers/userMap";
import { Email } from "../../domain/email";

export class MongoUserRepo implements IUserRepo {

    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async exists(email: Email): Promise<boolean> {
        const UserModel = this.models.userModel;
        const userModel = await UserModel.findOne({ email: email.value });
        return !!userModel === true;
    }
    getUserByUserId(userId: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    async getUserByEmail(email: string | Email): Promise<User> {
        const UserModel = this.models.userModel;
        const baseUser = await UserModel.findOne({
            email: email instanceof Email
                ? (<Email>email).value
                : email
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
    }

}