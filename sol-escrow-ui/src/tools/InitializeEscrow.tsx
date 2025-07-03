import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

type Props = {
  onInitialize: (amount: number, takerInput: string) => Promise<void>;
};

export default function InitializeEscrowForm({ onInitialize }: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [taker, setTaker] = useState("");

  return (
    <Box className="escrow-box" sx={{ maxWidth: 1200 }}>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 1100, // Even wider form
          margin: "0 auto",
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitted(false);
          await onInitialize(amount, taker);
          setSubmitted(true);
        }}
      >
        <TextField
          label="Escrow Amount (lamports)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
          InputProps={{
            sx: (theme) => ({
              fontSize: 20,
              padding: "8px 12px",
              borderRadius: 2,
              background: theme.palette.mode === "dark" ? "#181824" : "#f8f8ff",
            }),
          }}
          InputLabelProps={{
            sx: { fontSize: 18 },
          }}
        />
        <TextField
          label="Taker Public Key"
          value={taker}
          onChange={(e) => setTaker(e.target.value)}
          required
          InputProps={{
            sx: (theme) => ({
              fontSize: 20,
              padding: "8px 12px",
              borderRadius: 2,
              background: theme.palette.mode === "dark" ? "#181824" : "#f8f8ff",
            }),
          }}
          InputLabelProps={{
            sx: { fontSize: 18 },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            fontSize: 20,
            borderRadius: 2,
            fontWeight: 700,
            py: 1,
            mt: 2,
          }}
        >
          Initialize Escrow
        </Button>
        {submitted && <div>Escrow initialized!</div>}
      </form>
    </Box>
  );
}
