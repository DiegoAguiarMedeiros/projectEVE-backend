
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import Envelopes from './Envelopes';

class EnvelopesAmounts extends Model {
  static associate(models: any) {
    this.belongsTo(models.Envelopes, { foreignKey: 'envelope_id', as: 'Envelope' });
  }
}

EnvelopesAmounts.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'EnvelopesAmounts',
  tableName: 'envelopes_amounts',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  timestamps: true
});

export default EnvelopesAmounts;