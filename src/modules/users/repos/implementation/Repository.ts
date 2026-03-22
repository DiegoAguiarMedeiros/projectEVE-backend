
import { Op } from "sequelize";
import { UserMap as Mapper } from "../../mappers";
import { Email } from "../../domain/Email";
import { User } from "../../domain/User";
import { Interface, FindAllUsersFilters, FindAllUsersResult } from "../Interface";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";

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

    async getUserByVerificationToken(token: string): Promise<User | null> {
        const rawData = await this.model.findOne({
            where: { email_verification_token: token }
        });
        if (!rawData) return null;
        return Mapper.toDomain(rawData);
    }

    async create(data: User): Promise<void> {
        const exists = await this.exists(data.email);

        if (!exists) {
            const rawUser = await Mapper.toPersistence(data);
            await this.model.create(rawUser);
            DomainEvents.dispatchEventsForAggregate(data.id);
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

    async delete(userId: string): Promise<void> {
        await this.model.destroy({ where: { id: userId } });
    }

    async findAll(filters: FindAllUsersFilters): Promise<FindAllUsersResult> {
        const where: any = {};

        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${filters.search}%` } },
                { email: { [Op.iLike]: `%${filters.search}%` } },
            ];
        }

        if (filters.isDeleted !== undefined) {
            where.is_deleted = filters.isDeleted;
        }

        if (filters.isAdmin !== undefined) {
            where.is_admin_user = filters.isAdmin;
        }

        const offset = (filters.page - 1) * filters.limit;

        const { count, rows } = await this.model.findAndCountAll({
            where,
            limit: filters.limit,
            offset,
            order: [['created_at', 'DESC']],
            raw: true,
        });

        return {
            users: rows.map((r: any) => Mapper.toDomain(r)),
            total: count,
        };
    }
}