import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import User from './Users';

class Incomes extends Model { }

Incomes.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    payment_day: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 31,
        }
    },
}, {
    sequelize,
    modelName: 'Incomes',
    tableName: 'incomes',
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    timestamps: true 
});

export default Incomes;
