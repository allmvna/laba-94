import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchCocktails } from "./cocktailThunk";
import { selectCocktails, selectLoadingCocktail, selectErrorCocktail } from "./cocktailSlice";
import { CircularProgress, Alert, Card, CardContent, CardMedia, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import axiosAPI from "../../axiosAPI.ts";
import {selectUser} from "../users/userSlice.ts";

const Cocktails = () => {
  const dispatch = useAppDispatch();
  const cocktails = useAppSelector(selectCocktails) || [];
  const isLoading = useAppSelector(selectLoadingCocktail);
  const error = useAppSelector(selectErrorCocktail);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchCocktails({ token: user.token }))
          .unwrap()
          .catch((error) => {
            console.error("Failed to fetch cocktails:", error);
          });
    }
  }, [dispatch, user?.token]);

  return (
      <Grid container spacing={3} justifyContent="center" sx={{ display: "flex", flexWrap: "wrap" }}>
        {isLoading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!isLoading && !error && cocktails.length === 0 && (
            <Alert severity="info">No cocktails found.</Alert>
        )}
        {!isLoading && !error && cocktails.map((cocktail) => (
            <Grid key={cocktail._id} sx={{ flexBasis: "25%" }}>
              <Card
                  sx={{
                    minWidth: 200,
                    maxWidth: 250,
                    borderRadius: "10px",
                    cursor: "pointer",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    '&:hover': {
                      transform: "scale(1.05)",
                      transition: "all 0.3s ease",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                    },
                    transition: "all 0.3s ease",
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                  }}
              >
                {cocktail.image && (
                    <CardMedia
                        component="img"
                        src={`${axiosAPI.defaults.baseURL}/${cocktail.image}`}
                        alt={cocktail.name}
                        sx={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                    />
                )}
                <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                      alignItems: "center",
                      padding: "12px",
                    }}
                >
                  <Typography
                      variant="h6"
                      sx={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: 'grey',
                        mb: 1,
                      }}
                  >
                    {cocktail.name}
                  </Typography>
                  <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                      }}
                  >
                    {cocktail.recipe}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
        ))}
      </Grid>
  );
};

export default Cocktails;
