import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import mongoDb from "./mongoDb";
import userRouter from "./routes/user/user";
import config from "./config";
import path from "path";
import cocktailRouter from "./routes/cocktail/cocktail";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.use('/cocktails', cocktailRouter);
app.use(express.static('public'));
app.use('/fixtures', express.static(path.join(__dirname, 'fixtures')));

const run = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });

    process.on('exit', err => {
        mongoDb.disconnect();
    })
};


run().catch(e => console.error(e));


