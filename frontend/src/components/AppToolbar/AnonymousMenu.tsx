import { Button } from "@mui/material";
import { Link as NavLink } from "react-router-dom";

const AnonymousMenu = () => {
  return (
    <>
      <Button
        component={NavLink}
        to="/register"
        sx={{
            color: "#0ff",
            border: "1px solid rgba(0, 255, 255, 0.5)",
            "&:hover": {
                backgroundColor: "rgba(0, 255, 255, 0.2)",
                boxShadow: "0px 0px 10px rgba(0, 255, 255, 0.8)",
            },
        }}
      >
        Sign up
      </Button>
      <Button
        component={NavLink}
        to="/login"
        sx={{
            color: "#ff0",
            border: "1px solid rgba(255, 255, 0, 0.5)",
            ml: 2,
            "&:hover": {
                backgroundColor: "rgba(255, 255, 0, 0.2)",
                boxShadow: "0px 0px 10px rgba(255, 255, 0, 0.8)",
            },
        }}
      >
        Sign in
      </Button>
    </>
  );
};

export default AnonymousMenu;
