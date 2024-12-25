
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import Envelope from './envelope';
import UserPaymentMethod from './userPaymentMethod';

class Transaction extends Model { }

Transaction.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
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
    payment_method_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: UserPaymentMethod,
            key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
    },
    type: {
        type: DataTypes.ENUM('Crétido', 'Débito'),
        allowNull: false
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transation',
    timestamps: false
});

export default Transaction;