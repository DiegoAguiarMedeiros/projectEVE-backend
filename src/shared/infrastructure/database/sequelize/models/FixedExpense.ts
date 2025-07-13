import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import Envelope from './Envelopes';

class FixedExpenses extends Model {
    static associate(models: any) {
        FixedExpenses.belongsTo(models.Envelopes, { foreignKey: 'envelope_id' });
    }
}

FixedExpenses.init({
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
    }
}, {
    sequelize,
    modelName: 'FixedExpenses',
    tableName: 'fixed_expenses',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
});






export default FixedExpenses;
