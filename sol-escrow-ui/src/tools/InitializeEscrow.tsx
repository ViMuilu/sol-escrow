import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

type Props = {
  onInitialize: (amount: number, takerInput: string) => Promise<void>;
};

export default function InitializeEscrowForm({ onInitialize }: Props) {
  const [escrowAccountPubkey, setEscrowAccountPubkey] = useState("");
  const [initializerPubkey, setInitializerPubkey] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 400,
      }}
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitted(false);
        await onInitialize(amount, initializerPubkey);
        setSubmitted(true);
      }}
    >
      <TextField
        label="Escrow Account Public Key"
        value={escrowAccountPubkey}
        onChange={(e) => setEscrowAccountPubkey(e.target.value)}
        required
      />
      <TextField
        label="Initializer Public Key"
        value={initializerPubkey}
        onChange={(e) => setInitializerPubkey(e.target.value)}
        required
      />
      <TextField
        label="Escrow Amount (lamports)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        required
      />
      <Button variant="contained" color="primary" type="submit">
        Initialize Escrow
      </Button>
      {submitted && <div>Escrow initialized!</div>}
    </form>
  );
}
