
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';

class Envelopes extends Model { }

Envelopes.init({
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
  is_disable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Envelopes',
  tableName: 'envelopes'
});

export default Envelopes;