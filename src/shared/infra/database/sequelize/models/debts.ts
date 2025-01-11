import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import User from './user';
import CreditCards from './creditCards';
import Envelopes from './envelopes';

class Debts extends Model { }

Debts.init({
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
    installments_total: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    installments_paid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'paid', 'overdue'),
        allowNull: false,
        defaultValue: 'Pending'
    }
}, {
    sequelize,
    modelName: 'Debts',
    tableName: 'debts',
});



export default Debts;
