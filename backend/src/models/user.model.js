import mmongoose from 'mongoose';

const userSchema = new mmongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String,
            default: '',
        }
    },
    { timestamps: true }

);
const User = mmongoose.model('User', userSchema);

export default User;