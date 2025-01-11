
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import User from './user';
import Envelope from './baseEnvelopes';
import Debts from './debts';

class Envelopes extends Model { }

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
  modelName: 'Envelopes',
  tableName: 'envelopes'
});

export default Envelopes;