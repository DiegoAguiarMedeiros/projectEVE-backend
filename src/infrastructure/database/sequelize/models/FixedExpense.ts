import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import Envelope from './Envelope';

class FixedExpense extends Model { }

FixedExpense.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    envelope_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Envelope,
            key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
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
    modelName: 'FixedExpense',
    tableName: 'fixed_expense',
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    timestamps: true 
});

export default FixedExpense;
