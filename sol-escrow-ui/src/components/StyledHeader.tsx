import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import FiatSelector from "../tools/FiatSelector";

type Props = {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  fiat: string;
  setFiat: (v: string) => void;
  solPrice: number | null;
  setSolPrice: (v: number | null) => void;
};

const StyledHeader: React.FC<Props> = ({
  darkMode,
  setDarkMode,
  fiat,
  setFiat,
  solPrice,
  setSolPrice,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 4,
      borderRadius: 3,
      px: 3,
      py: 2,
      background: darkMode
        ? "linear-gradient(90deg, #2a003f 0%, #1a1a2e 100%)"
        : "linear-gradient(90deg, #eaffea 0%, #f8f8ff 100%)",
      boxShadow: darkMode ? "0 0 24px #a259f7" : "0 0 16px #39ff14",
    }}
  >
    <Typography
      variant="h4"
      sx={{
        fontWeight: 800,
        letterSpacing: 1,
        color: darkMode ? "#fff" : "#000",
        fontFamily:
          "'Detacher', 'Orbitron', 'Share Tech Mono', 'Montserrat', 'Segoe UI', Arial, sans-serif",
        textTransform: "uppercase",
      }}
    >
      Sol Escrow
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <FiatSelector
        fiat={fiat}
        setFiat={setFiat}
        solPrice={solPrice}
        setSolPrice={setSolPrice}
      />
      <IconButton
        onClick={() => setDarkMode(!darkMode)}
        color="inherit"
        aria-label="toggle dark mode"
        size="large"
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Box>
  </Box>
);

export default StyledHeader;
