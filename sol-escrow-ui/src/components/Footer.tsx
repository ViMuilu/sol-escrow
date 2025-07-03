import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => (
  <Box
    sx={{
      width: "100%",
      py: 3,
      mt: 6,
      textAlign: "center",
      background: (theme) =>
        theme.palette.mode === "dark" ? "#181824" : "#f8f8ff",
      borderTop: (theme) =>
        `1px solid ${theme.palette.mode === "dark" ? "#333" : "#ccc"}`,
    }}
    component="footer"
  >
    <Typography variant="body2" color="text.secondary">
      &copy; {new Date().getFullYear()} Sol Escrow. All rights reserved.
    </Typography>
  </Box>
);

export default Footer;
