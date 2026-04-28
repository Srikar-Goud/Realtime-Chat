import jwt from 'jsonwebtoken';

export const generateToken = (userId,res) => {
    // Implement JWT token generation logic here
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('jwt',token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
    })
}