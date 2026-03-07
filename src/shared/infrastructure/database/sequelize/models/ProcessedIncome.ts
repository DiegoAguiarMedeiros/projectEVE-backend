import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import Users from './Users';

class ProcessedIncome extends Model { }

ProcessedIncome.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Users,
            key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
    },
    day: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    month: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_income_processed: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    processed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    is_reprocessed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_splitted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    should_add_fixed_expenses: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    aux_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'ProcessedIncome',
    tableName: 'processed_incomes',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
});

export default ProcessedIncome;