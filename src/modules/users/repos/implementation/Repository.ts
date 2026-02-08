
import { UserMap as Mapper } from "../../mappers";
import { Email } from "../../domain/Email";
import { User } from "../../domain/User";
import { Interface } from "../Interface";

export class Repository implements Interface {
    private models: any;
    private model: any;

    constructor(models: any) {
        this.models = models;
        this.model = this.models.Users;
    }

    async exists(data: Email): Promise<boolean> {
        const rawData = await this.model.findOne({
            where: {
                email: data.value
            }
        });
        return !!rawData === true;
    }

    async getUserByEmail(data: Email): Promise<User> {
        const rawData = await this.model.findOne({
            where: {
                email: data.value
            }
        });
        if (!!rawData === false) throw new Error("User not found.")
        return Mapper.toDomain(rawData);
    }

    async getUserByUserId(userId: string): Promise<User> {
        const data = await this.model.findOne({
            where: {
                id: userId
            }
        });
        if (!!data === false) throw new Error("User not found.")
        return Mapper.toDomain(data);
    }

    async create(data: User): Promise<void> {
        const exists = await this.exists(data.email);

        if (!exists) {
            const rawUser = await Mapper.toPersistence(data);
            await this.model.create(rawUser);
        }

        return;
    }

    async save(data: User): Promise<void> {
        const rawUser = await Mapper.toPersistence(data);
        const exists = await this.exists(data.email);

        if (exists) {
            await this.model.update(rawUser, {
                where: { email: data.email.value }
            });
        } else {
            await this.model.create(rawUser);
        }

        return;
    }
}