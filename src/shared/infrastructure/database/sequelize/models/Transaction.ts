import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import CreditCards from './CreditCard';
import MonthlyEnvelope from './MonthlyEnvelope';
import Debt from './Debt';

class Transaction extends Model { }

Transaction.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    credit_card_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: CreditCards,
            key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
    },
    debt_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Debt,
            key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
    },
    monthly_envelope_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: MonthlyEnvelope,
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
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    payment_method: {
        type: DataTypes.ENUM('CreditCard', 'DebitCard', 'Cash', 'BankTransfer', 'Pix', 'Ticket'),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Credit', 'Debit'),
        allowNull: false,
        defaultValue: 'Debit'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Completed','Overdue', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Pending'
    }
}, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transaction',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
});

export default Transaction;
