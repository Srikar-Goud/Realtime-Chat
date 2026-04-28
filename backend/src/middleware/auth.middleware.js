import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';

export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded || !decoded.userId){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await User.findById(decoded.userId).select('-password');
        if(!user){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(500).json({ message: 'Unauthorized' });
    }
}