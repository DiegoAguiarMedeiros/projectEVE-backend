import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import Envelopes from './envelopes';

class Investments extends Model { }

Investments.init({
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
            model: Envelopes,
            key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false, 
    },
    type: {
        type: DataTypes.ENUM('fixed_income', 'variable_income', 'real_estate', 'crypto', 'other'),
        allowNull: false,
        defaultValue: 'fixed_income', 
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, 
    },
    application_date: {
        type: DataTypes.DATEONLY,
        allowNull: false, 
    },
    maturity_date: {
        type: DataTypes.DATEONLY,
        allowNull: true, 
    },
    status: {
        type: DataTypes.ENUM('active', 'closed', 'redeemed'),
        allowNull: false,
        defaultValue: 'active', 
    },
    profitability: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true, 
    }
}, {
    sequelize,
    modelName: 'Investments',
    tableName: 'investments',
});

export default Investments;
