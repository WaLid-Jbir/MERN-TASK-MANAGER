import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connect from './src/db/connect.js';
import fs from 'fs';
import errorHandler from './src/helpers/errorHandler.js';

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
app.use(cookieParser());
// error handler middleware
app.use(errorHandler);

// routes
const routeFiles = fs.readdirSync('./src/routes');

routeFiles.forEach((file) => {
    import (`./src/routes/${file}`)
    .then((route) => {
        app.use('/api/v1', route.default);
    })
    .catch((error) => {
        console.log('Failed to import route', error);
    })
});

const server = async () => {
    try {
        await connect();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log('Failed start the server', error.message);
        process.exit(1);
    }
};

server();