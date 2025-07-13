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
    aux_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'processed_incomes',
    modelName: 'ProcessedIncome',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
});

export default ProcessedIncome;