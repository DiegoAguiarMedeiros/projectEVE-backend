import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    is_email_verified: {
        type: Boolean,
        required: true,
    },
    is_admin_user: {
        type: Boolean,
        required: true,
    },
    is_deleted: {
        type: Boolean,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const UserModel = mongoose.model<any>('User', UserSchema);

export { UserModel, UserSchema };
