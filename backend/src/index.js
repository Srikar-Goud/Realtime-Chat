import express from 'express';

import dotenv from 'dotenv';
dotenv.config( {path: './src/.env'});
import { connectDB } from './lib/db.js';
import dns from 'dns';
import path from 'path';  
import cookieParser from 'cookie-parser';  
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';


dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes); 
app.use("/api/messages", messageRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
    connectDB();
}); 