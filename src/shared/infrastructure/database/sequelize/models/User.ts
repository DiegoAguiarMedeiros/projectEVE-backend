
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import Envelope from './Envelope';

class User extends Model {
    static associate(models: any) {
        User.hasMany(Envelope, { foreignKey: 'user_id' });
    }
}

User.init({
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
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
});


export default User;