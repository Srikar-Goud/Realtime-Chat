import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import { generateToken } from '../lib/utils.js';

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try{
        if(!email || !fullName || !password){
            return res.status(400).json({ message: 'All fields are required' });
        }
        if(password.length < 6){
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });
        if(newUser){
            //Generate JWT token
            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            })
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }catch(error){
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        generateToken(user._id, res);
        res.json({
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};