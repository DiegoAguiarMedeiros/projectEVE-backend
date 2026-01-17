
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';

class Users extends Model {
    static associate(models: any) {
        Users.hasMany(models.Incomes, { foreignKey: 'user_id' });
        Users.hasMany(models.Envelopes, { foreignKey: 'user_id' });
        Users.hasMany(models.CreditCards, { foreignKey: 'user_id' });
        Users.hasMany(models.ProcessedIncome, { foreignKey: 'user_id' });
    }
}

Users.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true
    },
    is_email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    name: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_admin_user: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_registration_complete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
});


export default Users;