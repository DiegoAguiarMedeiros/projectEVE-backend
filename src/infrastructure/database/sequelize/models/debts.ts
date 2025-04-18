import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
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
    payment_day: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 31,
        }
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
});



export default Debts;
