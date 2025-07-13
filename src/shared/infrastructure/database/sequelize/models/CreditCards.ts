
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import User from './Users';

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
    type: DataTypes.ENUM(
      'Visa',
      'Mastercard',
      'American Express',
      'Discover',
      'Diners Club',
      'JCB',
      'Elo',
      'Hipercard'
    ),
    allowNull: false,
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
}, {
  sequelize,
  modelName: 'CreditCards',
  tableName: 'credit_cards',
  createdAt: 'created_at', 
  updatedAt: 'updated_at',
  timestamps: true 
});

export default CreditCards;