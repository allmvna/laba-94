import mongoose from 'mongoose';
import config from "./config";
import User from "./models/User/User";
import {randomUUID} from "crypto";
import Cocktail from "./models/Cocktail/Cocktail";


const run = async () => {

    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
        await db.dropCollection('cocktails');
    } catch (e) {
        console.log("Collections does not exist, skipping drop...");
    }


    const [user, admin] = await User.create([
        {
            username: 'user@gmail.com',
            password: '123',
            avatar: 'fixtures/user.jpg',
            role: 'user',
            token: randomUUID(),
            displayName: 'User',
        },
        {
            username: 'admin@gmail.com',
            password: '456',
            avatar: 'fixtures/admin.jpg',
            role: 'admin',
            token: randomUUID(),
            displayName: 'Admin',
        },
    ]);


    const cocktails = await Cocktail.create([
        {
            user: user._id,
            name: "Mojito",
            image: "fixtures/mojito.jpg",
            recipe: "A refreshing cocktail with mint, lime, and rum.",
            ingredients: [
                { name: "White rum", amount: "50ml" },
                { name: "Lime juice", amount: "30ml" },
                { name: "Sugar", amount: "2 tsp" },
                { name: "Mint leaves", amount: "6-8 leaves" },
                { name: "Soda water", amount: "Top up" },
            ],
            isPublished: true,
            rating: [
                { user: admin._id, value: 5 },
            ],
            averageRating: 5,
        },
        {
            user: admin._id,
            name: "Margarita",
            image: "fixtures/margarita.jpg",
            recipe: "A classic cocktail with tequila, lime, and triple sec.",
            ingredients: [
                { name: "Tequila", amount: "50ml" },
                { name: "Triple sec", amount: "20ml" },
                { name: "Lime juice", amount: "30ml" },
                { name: "Salt", amount: "For rim" },
            ],
            isPublished: false,
            rating: [
                { user: user._id, value: 4 },
            ],
            averageRating: 4,
        },
        {
            user: user._id,
            name: "Pina Colada",
            image: "fixtures/pina-colada.jpeg",
            recipe: "A tropical cocktail with pineapple, coconut, and rum.",
            ingredients: [
                { name: "White rum", amount: "50ml" },
                { name: "Coconut cream", amount: "50ml" },
                { name: "Pineapple juice", amount: "100ml" },
            ],
            isPublished: true,
            rating: [],
            averageRating: 0,
        },
    ]);

    console.log("Fixtures created successfully!");
    console.log("Users:", [user, admin]);
    console.log("Cocktails:", cocktails);

    await db.close();
};


run().catch(console.error);