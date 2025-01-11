import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import User from './user';
import CreditCards from './creditCards';
import Envelopes from './envelopes';

class Transactions extends Model { }

Transactions.init({
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
        type: DataTypes.ENUM('CreditCard', 'DebitCard', 'Cash', 'BankTransfer','Pix'),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Credit', 'Debit'),
        allowNull: false,
        defaultValue: 'Debit'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Completed'),
        allowNull: false,
        defaultValue: 'Pending'
    }
}, {
    sequelize,
    modelName: 'Transactions',
    tableName: 'transactions',
});

export default Transactions;
