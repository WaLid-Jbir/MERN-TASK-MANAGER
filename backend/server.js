import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

// middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});