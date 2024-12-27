
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import User from './user';
import Envelope from './envelopes';

class UserEnvelopes extends Model { }

UserEnvelopes.init({
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
  balance: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  disable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'UserEnvelopes',
  tableName: 'user_envelopes'
});

export default UserEnvelopes;