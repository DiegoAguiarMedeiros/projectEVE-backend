import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import Envelopes from './Envelopes';
import CreditCards from './CreditCards';

class Transactions extends Model {
    static associate(models: any) {
        this.belongsTo(models.Envelopes, { foreignKey: 'envelope_id', as: 'Envelope' });
    }
}

Transactions.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    processed_incomes_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
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
    payment_method: {
        type: DataTypes.ENUM('CreditCard', 'DebitCard', 'Cash', 'BankTransfer', 'Pix', 'Ticket'),
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
    type: {
        type: DataTypes.ENUM('Credit', 'Debit'),
        allowNull: false,
        defaultValue: 'Debit'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Completed', 'Overdue', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Pending'
    }
}, {
    sequelize,
    modelName: 'Transactions',
    tableName: 'transactions',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
});

export default Transactions;
