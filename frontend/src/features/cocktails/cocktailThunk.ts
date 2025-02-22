import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosAPI from "../../axiosAPI.ts";
import axios from "axios";

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
            console.log("Fetched cocktails:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching cocktails:", error);
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.error || "Error fetching cocktails");
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);