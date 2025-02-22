import express from "express";
import auth, {RequestWithUser} from "../../middleware/auth";
import permit from "../../middleware/permit";
import {imagesUpload} from "../../multer";
import Cocktail from "../../models/Cocktail/Cocktail";
import {ObjectId} from "mongodb";

const cocktailRouter = express.Router();

cocktailRouter.get('/', auth, async (req, res) => {
    try {
        const expressReq = req as RequestWithUser;
        const user = expressReq.user;

        const query: { user?: ObjectId | string; isPublished?: boolean } = {};

        if (user) {
            if (user.role !== 'admin') {
                query.user = user._id;
            }
        } else {
            query.isPublished = true;
        }

        const cocktails = await Cocktail.find(query);

        if (!cocktails.length) {
            res.status(200).json({ message: 'No cocktails found', cocktails: [] });
            return;
        }

        res.status(200).json(cocktails);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cocktails'});
    }
})


cocktailRouter.get('/:id', async (req, res) => {
    try {
        const cocktailId = req.params.id;
        const cocktail = await Cocktail.findById(cocktailId);

        if (!cocktail) {
            res.status(404).json({ error: 'Cocktail not found' });
            return;
        }

        res.status(200).json(cocktail);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching this cocktail' });
    }
});

cocktailRouter.post('/add', auth, imagesUpload.single('image'), async (req, res) => {
    const expressReq = req as RequestWithUser;
    const user = expressReq.user;

    if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    try {
        const { name, recipe, ingredients } = req.body;

        const newCocktail = new Cocktail({
            user: user._id,
            name,
            recipe,
            ingredients: JSON.parse(ingredients),
            image: req.file ? '/images' + req.file.filename : null,
            isPublished: false
        });


        await newCocktail.save();
        res.status(201).json({ message: 'Cocktail created successfully', cocktail: newCocktail });


    } catch (error) {
        res.status(500).json({ error: 'Error creating cocktail' });
    }
});

cocktailRouter.post('/:id/rate', auth, async (req, res) => {
    const expressReq = req as RequestWithUser;
    const user = expressReq.user;

    if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    try {
        const { rating } = req.body;
        const cocktailId = req.params.id;

        if (rating < 1 || rating > 5) {
            res.status(400).json({ error: 'Rating must be between 1 and 5' });
            return;
        }

        const cocktail = await Cocktail.findById(cocktailId);

        if (!cocktail) {
            res.status(404).json({ error: 'Cocktail not found' });
            return;
        }

        const existingRating = cocktail.rating.find((r) => r.user.toString() === user._id.toString());

        if (existingRating) {
            existingRating.value = rating;
        } else {
            cocktail.rating.push({ user: user._id, value: rating });
        }

        const totalRatings = cocktail.rating.length;
        const sumRatings = cocktail.rating.reduce((acc, r) => acc + r.value, 0);
        cocktail.averageRating = sumRatings / totalRatings;

        await cocktail.save();

        res.status(200).json({ message: 'Rating added successfully', cocktail });
    } catch (error) {
        res.status(500).json({ error: 'Error rating cocktail' });
    }
});

cocktailRouter.delete('/:id', auth, permit('admin'), async (req, res) => {
    const expressReq = req as RequestWithUser;
    const user = expressReq.user;

    if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    try {
        const cocktailId = req.params.id;
        const cocktail = await Cocktail.findByIdAndDelete(cocktailId);

        if (!cocktail) {
            res.status(404).json({ error: 'Cocktail not found' });
            return;
        }


        res.status(200).json({ message: 'Cocktail deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting album' });
    }
});

cocktailRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req, res) => {
    try {
        const cocktailId = req.params.id;
        const cocktail = await Cocktail.findById(cocktailId);

        if (!cocktail) {
            res.status(404).json({ error: 'Cocktail not found' });
            return;
        }

        cocktail.isPublished = !cocktail.isPublished;
        await cocktail.save();

        res.status(200).json({ message: `Cocktail ${cocktail.isPublished ? 'true' : 'false'}`, cocktail });
    } catch (error) {
        res.status(500).json({ error: 'Error toggling cocktail publication' });
    }
});

export default cocktailRouter;
