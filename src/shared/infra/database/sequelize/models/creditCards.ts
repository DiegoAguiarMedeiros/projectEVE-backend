
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';

class CreditCards extends Model { }

CreditCards.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  flag: {
    type: DataTypes.STRING(10),
    allowNull: false
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
  modelName: 'CreditCards',
  tableName: 'credit_cards',
  timestamps: false
});

export default CreditCards;