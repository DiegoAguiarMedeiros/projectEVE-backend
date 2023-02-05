import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    user_email: {
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
    user_password: {
        type: String,
        required: true,
    },
});

const User = mongoose.model<any>('User', UserSchema);

export default User;
