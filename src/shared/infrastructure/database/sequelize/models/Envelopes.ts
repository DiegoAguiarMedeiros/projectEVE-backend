
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import Users from './Users';
import Debt from './Debts';

class Envelopes extends Model {
  static associate(models: any) {
    Users.hasMany(models.Debts, { foreignKey: 'envelope_id' });
  }
}

Envelopes.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
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
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    validate: {
      is: /^#[0-9A-Fa-f]{6}$/
    }
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  percentage: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
}, {
  sequelize,
  modelName: 'Envelopes',
  tableName: 'envelopes',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  timestamps: true
});

export default Envelopes;