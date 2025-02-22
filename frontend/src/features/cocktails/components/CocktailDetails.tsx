import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Alert, Button, Card, CardContent, CardMedia, CircularProgress, Typography} from "@mui/material";
import axiosAPI from "../../../axiosAPI.ts";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {selectErrorCocktail, selectLoadingCocktail, selectOneCocktail} from "../cocktailSlice.ts";
import {fetchCocktailById, postRating} from "../cocktailThunk.ts";
import ReactStars from "react-stars";

const CocktailDetails = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const cocktail = useAppSelector(selectOneCocktail);
    console.log("Cocktail from state:", cocktail);
    const isLoading = useAppSelector(selectLoadingCocktail);
    const error = useAppSelector(selectErrorCocktail);
    const [rating, setRating] = useState<number | null>(null);
    const [ratingSubmitting, setRatingSubmitting] = useState(false);


    useEffect(() => {
        if (id) {
            dispatch(fetchCocktailById(id))
                .unwrap()
                .catch((error) => console.error("Error fetching cocktail:", error));
        }
    }, [dispatch, id]);

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    };

    const handleSubmitRating = async () => {
        if (rating && id) {
            setRatingSubmitting(true);
            try {
                await dispatch(postRating({ cocktailId: id, rating })).unwrap();
                setRatingSubmitting(false);
                setRating(null);
            } catch (error) {
                setRatingSubmitting(false);
                console.error("Error submitting rating:", error);
            }
        }
    };


    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!cocktail) {
        return <Alert severity="info">Cocktail not found.</Alert>;
    }

    if (!cocktail.ingredients) {
        return <Alert severity="warning">Ingredients data is missing.</Alert>;
    }

    return (
        <>
            <Card sx={{ maxWidth: 900, margin: "auto", borderRadius: "10px"}}>
                {cocktail.image && (
                    <CardMedia
                        component="img"
                        image={`${axiosAPI.defaults.baseURL}/${cocktail.image}`}
                        alt={cocktail.name}
                        sx={{
                            width: "100%",
                            height: 200,
                            objectFit: "contain",
                        }}
                    />
                )}
                <CardContent>
                    <Typography variant="h4" component="div" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                        {cocktail.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 2 }}>
                        {cocktail.recipe}
                    </Typography>

                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                        Ingredients:
                    </Typography>
                    <ul>
                        {cocktail.ingredients.map((ingredient, index) => (
                            <li key={index}>
                                <Typography variant="body2">
                                    {ingredient.name}: {ingredient.amount}
                                </Typography>
                            </li>
                        ))}
                    </ul>

                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Average Rating: {cocktail.averageRating || "N/A"}
                    </Typography>

                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Rate this Cocktail:
                    </Typography>
                    <ReactStars
                        count={5}
                        value={rating ?? 0}
                        onChange={handleRatingChange}
                        size={24}
                        half={true}
                        color2={"#ffd700"}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitRating}
                        disabled={rating === null || ratingSubmitting}
                    >
                        {ratingSubmitting ? "Submitting..." : "Submit Rating"}
                    </Button>
                </CardContent>
            </Card>
        </>
    );
};

export default CocktailDetails;
