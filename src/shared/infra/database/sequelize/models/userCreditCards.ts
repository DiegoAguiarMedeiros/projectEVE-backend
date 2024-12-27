
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
  }
}, {
  sequelize,
  modelName: 'UserCreditCards',
  tableName: 'user_credit_cards'
});

export default UserCreditCards;