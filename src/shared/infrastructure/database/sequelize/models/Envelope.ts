
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import User from './User';
import MonthlyEnvelope from './MonthlyEnvelope';
import Debt from './Debt';

class Envelope extends Model {
  static associate(models: any) {
    Envelope.belongsTo(models.User, { foreignKey: 'user_id' });
    Envelope.hasMany(models.MonthlyEnvelope, { foreignKey: 'envelope_id' });
    Envelope.hasMany(models.Debt, { foreignKey: 'envelope_id' });
  }
}

Envelope.init({
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
      model: User,
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
  modelName: 'Envelope',
  tableName: 'envelope',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  timestamps: true
});

export default Envelope;