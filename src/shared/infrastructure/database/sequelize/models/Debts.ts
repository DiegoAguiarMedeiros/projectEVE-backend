import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import Envelopes from './Envelopes';

class Debts extends Model { }

Debts.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    installments_total: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    installments_paid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    payment_day: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 31,
        }
    },
    envelope_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Envelopes,
            key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'paid'),
        allowNull: false,
        defaultValue: 'Pending'
    }
}, {
    sequelize,
    modelName: 'Debts',
    tableName: 'debts',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
});



export default Debts;
