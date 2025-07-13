
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';

class BaseEnvelope extends Model { }

BaseEnvelope.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    validate: {
      is: /^#[0-9A-Fa-f]{6}$/
    }
  }
}, {
  sequelize,
  modelName: 'BaseEnvelope',
  tableName: 'base_envelope',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  timestamps: true
});

export default BaseEnvelope;