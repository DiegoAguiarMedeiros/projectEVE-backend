import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import Envelopes from './Envelopes';

class Goals extends Model {
    static associate(models: any) {
        Goals.belongsTo(models.Envelopes, { foreignKey: 'envelope_id' });
    }
}

Goals.init({
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
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    amount_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    percentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0,
            max: 100
        }
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Goals',
    tableName: 'goals',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
});






export default Goals;
