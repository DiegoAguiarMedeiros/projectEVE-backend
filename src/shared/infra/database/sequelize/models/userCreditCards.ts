
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import User from './user';
import CreditCards from './creditCards';

class UserCreditCards extends Model { }

UserCreditCards.init({
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
  credit_cards_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: CreditCards,
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
  modelName: 'UserCreditCards',
  tableName: 'user_credit_cards',
  timestamps: false
});

export default UserCreditCards;