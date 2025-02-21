import mongoose from "mongoose";

const Schema  = mongoose.Schema;

const cocktailSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    recipe: {
        type: String,
        required: true
    },
    ingredients: [
        {
            name: { type: String, required: true },
            amount: { type: String, required: true }
        }
    ],
    rating: [
        {
            user: { type: Schema.Types.ObjectId, ref: "User", required: true },
            value: { type: Number, min: 1, max: 5, required: true }
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    }
});

const Cocktail = mongoose.model("Cocktail", cocktailSchema);
export default Cocktail;