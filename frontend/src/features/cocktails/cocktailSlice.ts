import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../app/store.ts";
import {fetchCocktailById, fetchCocktails, postRating} from "./cocktailThunk.ts";


export interface ICocktail {
    _id: string;
    user: string;
    name: string;
    image: string | null;
    recipe: string;
    ingredients: { name: string; amount: string }[];
    rating: { user: string; value: number }[];
    averageRating: number;
    isPublished: boolean;
}

interface CocktailState {
    cocktails: ICocktail[],
    cocktail: ICocktail | null;
    isLoading: boolean,
    error: string | null;
}

const initialState: CocktailState = {
    cocktails: [],
    cocktail: null,
    isLoading: false,
    error: null,
};

export const selectOneCocktail = (state: RootState) => state.cocktails.cocktail;
export const selectCocktails = (state: RootState) => state.cocktails.cocktails;
export const selectLoadingCocktail = (state: RootState) =>
    state.cocktails.isLoading;
export const selectErrorCocktail = (state: RootState) =>
    state.cocktails.error;


export const cocktailSlice = createSlice({
    name: "cocktail",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCocktails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCocktails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cocktails = action.payload;
            })
            .addCase(fetchCocktails.rejected, (state,action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCocktailById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCocktailById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cocktail = action.payload;
            })
            .addCase(fetchCocktailById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(postRating.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(postRating.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedCocktail = action.payload.cocktail;
                if (state.cocktail && state.cocktail._id === updatedCocktail._id) {
                    state.cocktail = updatedCocktail;
                }
            })
            .addCase(postRating.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

    },
});

export const cocktailsReducer = cocktailSlice.reducer;

