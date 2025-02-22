import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosAPI from "../../axiosAPI.ts";
import axios from "axios";
import {ICocktail} from "./cocktailSlice.ts";

export const fetchCocktails = createAsyncThunk(
    "cocktails/fetchCocktails",
    async ({ token }: { token: string }, { rejectWithValue }) => {
        if (!token) {
            console.log("Unauthorized: Token is missing");
            return rejectWithValue("Unauthorized: Token is missing");
        }

        try {
            const response = await axiosAPI.get("/cocktails", {
                headers: { Authorization: token },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.error || "Error fetching cocktails");
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const fetchCocktailById = createAsyncThunk<ICocktail, string, { rejectValue: string }>(
    "cocktails/fetchCocktailById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosAPI.get(`/cocktails/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.error || "Error fetching cocktail");
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const postRating = createAsyncThunk(
    "cocktails/postRating",
    async ({ cocktailId, rating }: { cocktailId: string, rating: number }, { rejectWithValue }) => {
        try {
            const response = await axiosAPI.post(`/cocktails/${cocktailId}/rate`, { rating });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.error || "Error submitting rating");
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);