import { IUserRepo } from "../userRepo";
import { UserName } from "../../domain/userName";
import { User } from "../../domain/user";
import { UserMap } from "../../mappers/userMap";
import { UserEmail } from "../../domain/userEmail";

export class MongoUserRepo implements IUserRepo {
    exists(userEmail: UserEmail): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getUserByUserId(userId: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    getUserByUserName(userName: string | UserName): Promise<User> {
        throw new Error("Method not implemented.");
    }
    save(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

}