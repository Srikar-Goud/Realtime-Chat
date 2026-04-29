import express from 'express';

import dotenv from 'dotenv';
dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET); // add this
console.log("CLOUDINARY_KEY:", process.env.CLOUDINARY_API_KEY); // add this

import { connectDB } from './lib/db.js';
import dns from 'dns';
import path from 'path';  
import cookieParser from 'cookie-parser';  
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';
import {app, server } from './lib/socket.js';


dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use("/api/auth", authRoutes); 
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'frontend/dist')));
    app.get(/(.*)/, (req, res) => {  // ✅ new syntax
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
}

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
    connectDB();
}); 