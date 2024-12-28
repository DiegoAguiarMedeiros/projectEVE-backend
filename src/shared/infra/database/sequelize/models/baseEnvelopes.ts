
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';

class BaseEnvelopes extends Model { }

BaseEnvelopes.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'BaseEnvelopes',
  tableName: 'base_envelopes'
});

export default BaseEnvelopes;