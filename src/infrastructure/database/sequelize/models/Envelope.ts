
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import User from './User';

class Envelope extends Model { }

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
  balance: {
    type: DataTypes.FLOAT,
    allowNull: true
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
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  is_editable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Envelope',
  tableName: 'envelope',
  createdAt: 'created_at', 
  updatedAt: 'updated_at',
  timestamps: true 
});

export default Envelope;