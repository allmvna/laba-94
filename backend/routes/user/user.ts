import express from "express";
import {Error} from 'mongoose';
import User from "../../models/User/User";
import {OAuth2Client} from "google-auth-library";
import config from "../../config";
import {imagesUpload} from "../../multer";

const usersRouter = express.Router();

const client = new OAuth2Client(config.google.clientId);

usersRouter.post('/google', async (req, res, next) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.google.clientId,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            res.status(400).send({ error: "Google login error!" });
            return;
        }

        const email = payload["email"];
        const id = payload["sub"];
        const displayName = payload["name"];

        if (!email) {
            res.status(400).send({ error: "Not enough user data to continue" });
            return;
        }

        let user = await User.findOne({ googleID: id });

        if (!user) {
            user = new User({
                username: email,
                password: crypto.randomUUID(),
                googleID: id,
                displayName,
            });
        }

        user.generateToken();
        await user.save();
        res.send({ message: "Login with Google successful!", user });
    } catch(error){
        next(error);
    }
})

usersRouter.post("/", imagesUpload.single('avatar'), async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            displayName: req.body.displayName,
            avatar: req.file ? '/images' + req.file.filename : null,
        });

        user.generateToken();
        await user.save();
        res.send(user);
    } catch (error){
        if(error instanceof Error.ValidationError){
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            res.status(400).send({error: 'Username not found'});
            return;
        }

        const isMatch = await user.checkPassword(password);

        if (!isMatch) {
            res.status(400).send({error: 'Password is wrong'});
            return;
        }

        user.generateToken();
        await user.save();

        res.send({message: 'Username and password correct!', user});

    } catch (error){
        if(error instanceof Error.ValidationError){
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});


usersRouter.delete('/sessions', async (req, res, next) => {
    try {
        const token = req.get('Authorization');

        const success = {message: 'Success'};

        if (!token) {
            res.send(success);
            return;
        }

        const user = await User.findOne({token});

        if (!user){
            res.send(success)
            return;
        }

        user.generateToken();
        await user.save();
        res.send(success);
        return;
    } catch (e) {
        return next(e);
    }
});


export default usersRouter;