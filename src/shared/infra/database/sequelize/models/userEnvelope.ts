
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import User from './user';
import Envelope from './envelope';

class UserEnvelope extends Model { }

UserEnvelope.init({
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
  envelope_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Envelope,
      key: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'UserEnvelope',
  tableName: 'user_envelope',
  timestamps: false
});

export default UserEnvelope;