import React, { useEffect } from "react";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
} from "@mui/material";

export const FIAT_OPTIONS = [
  { code: "USD", label: "US Dollar" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "British Pound" },
];

type Props = {
  fiat: string;
  setFiat: (fiat: string) => void;
  solPrice: number | null;
  setSolPrice: (price: number | null) => void;
};

const FiatSelector: React.FC<Props> = ({
  fiat,
  setFiat,
  solPrice,
  setSolPrice,
}) => {
  useEffect(() => {
    let cancelled = false;
    const fetchPrice = async () => {
      try {
        const proxy = "https://corsproxy.io/?";
        const url = `${proxy}https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=${fiat.toLowerCase()}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!cancelled) {
          setSolPrice(data.solana?.[fiat.toLowerCase()] ?? null);
        }
      } catch {
        if (!cancelled) setSolPrice(null);
      }
    };
    fetchPrice();
    return () => {
      cancelled = true;
    };
  }, [fiat, setSolPrice]);

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
        <InputLabel id="fiat-select-label">Fiat</InputLabel>
        <Select
          labelId="fiat-select-label"
          value={fiat}
          label="Fiat"
          onChange={(e) => setFiat(e.target.value)}
          sx={{
            borderRadius: 2,
            background: "rgba(255,255,255,0.05)",
            fontWeight: 600,
            "& .MuiSelect-icon": {
              color: "inherit",
            },
          }}
        >
          {FIAT_OPTIONS.map((opt) => (
            <MenuItem key={opt.code} value={opt.code}>
              {opt.label} ({opt.code})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="body2" color="text.secondary">
        {solPrice !== null
          ? `1 SOL ≈ ${solPrice.toLocaleString(undefined, {
              style: "currency",
              currency: fiat,
            })}`
          : "Loading..."}
      </Typography>
    </Box>
  );
};

export default FiatSelector;
