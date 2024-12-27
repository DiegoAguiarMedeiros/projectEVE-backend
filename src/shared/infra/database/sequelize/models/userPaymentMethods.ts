
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import User from './user';

class UserPaymentMethods extends Model { }

UserPaymentMethods.init({
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
  payment_method: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'UserPaymentMethods',
  tableName: 'user_payment_methods'
});

export default UserPaymentMethods;