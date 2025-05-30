
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import Envelope from './Envelope';
import Transaction from './Transaction';

class MonthlyEnvelope extends Model {
  static associate(models: any) {
    MonthlyEnvelope.hasMany(Transaction, { foreignKey: 'monthly_envelope_id' });
  }
 }

MonthlyEnvelope.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  envelope_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Envelope,
      key: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  percentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^(0[1-9]|1[0-2])\/\d{4}$/ 
    }
  },
}, {
  sequelize,
  modelName: 'MonthlyEnvelope',
  tableName: 'monthly_envelope',
  createdAt: 'created_at', 
  updatedAt: 'updated_at',
  timestamps: true 
});





export default MonthlyEnvelope;