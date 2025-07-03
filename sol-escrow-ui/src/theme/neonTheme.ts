import { createTheme } from "@mui/material";

export const getNeonTheme = (darkMode: boolean) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            border: `2px solid`,
            borderColor: darkMode ? "#a259f7" : "#39ff14",
            color: darkMode ? "#fff" : "#000", // <-- This line sets text color
            background: "transparent",
            borderRadius: 8,
            padding: "8px 20px",
            fontWeight: 600,
            fontSize: 16,
            boxShadow: "none",
            transition: "all 0.2s",
            cursor: "pointer",
            outline: "none",
            marginTop: 8,
            "&:hover": {
              background: darkMode ? "#2a003f" : "#eaffea",
              boxShadow: "none",
            },
          },
        },
      },
    },
  });
