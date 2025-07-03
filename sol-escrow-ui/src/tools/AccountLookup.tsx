import React, { useState, useMemo, useEffect } from "react";
import { Program, web3 } from "@coral-xyz/anchor";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

type Props = {
  program: Program | null;
  wallet: any;
  fiat: string;
  solPrice: number | null;
};

const AccountWithdraw: React.FC<Props> = ({
  program,
  wallet,
  fiat,
  solPrice,
}) => {
  const [initializer, setInitializer] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | undefined>(
    undefined
  );
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | undefined>(
    undefined
  );
  const [escrowAmount, setEscrowAmount] = useState<number | null>(null);

  const derivedPda = useMemo(() => {
    if (!initializer || !program) return "";
    try {
      const [pda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), new web3.PublicKey(initializer).toBuffer()],
        program.programId
      );
      return pda.toBase58();
    } catch {
      return "";
    }
  }, [initializer, program]);

  useEffect(() => {
    const fetchEscrow = async () => {
      setEscrowAmount(null);
      if (!program || !derivedPda) return;
      try {
        const escrowAccount = await (program.account as any).escrow.fetch(
          derivedPda
        );
        setEscrowAmount(Number(escrowAccount.amount));
      } catch {
        setEscrowAmount(null);
      }
    };
    fetchEscrow();
  }, [program, derivedPda]);

  const handleWithdraw = async () => {
    setWithdrawLoading(true);
    setWithdrawError(undefined);
    setWithdrawSuccess(undefined);
    try {
      if (!program) throw new Error("Program not loaded");
      if (!wallet?.publicKey) throw new Error("Wallet not connected");
      if (!initializer) throw new Error("No initializer public key provided");
      if (!derivedPda) throw new Error("Could not derive escrow PDA");

      await program.methods
        .withdraw()
        .accounts({
          escrowAccount: new web3.PublicKey(derivedPda),
          taker: wallet.publicKey,
        })
        .rpc();

      setWithdrawSuccess("Withdraw successful!");
    } catch (err: any) {
      setWithdrawError(err.message || "Withdraw failed");
    } finally {
      setWithdrawLoading(false);
    }
  };

  // --- Fiat value calculation ---
  const solAmount =
    escrowAmount !== null ? escrowAmount / web3.LAMPORTS_PER_SOL : null;
  const fiatValue =
    solAmount !== null && solPrice !== null ? solAmount * solPrice : null;

  return (
    <Box className="escrow-box" sx={{ maxWidth: 1200 }}>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 1100,
          margin: "0 auto",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleWithdraw();
        }}
      >
        <TextField
          label="Initializer Public Key"
          variant="outlined"
          size="small"
          fullWidth
          value={initializer}
          onChange={(e) => setInitializer(e.target.value)}
          placeholder="Enter initializer public key"
          style={{ marginBottom: 12, marginTop: 16 }}
          disabled={withdrawLoading}
          required
          InputProps={{
            sx: (theme) => ({
              fontSize: 20,
              padding: "8px 12px",
              borderRadius: 2,
              background: theme.palette.mode === "dark" ? "#181824" : "#f8f8ff",
            }),
          }}
        />
        {derivedPda && (
          <div style={{ marginTop: 8 }}>
            Escrow PDA: <code>{derivedPda}</code>
          </div>
        )}
        {escrowAmount !== null && (
          <div style={{ marginTop: 8 }}>
            Escrow Amount:{" "}
            <strong>
              {solAmount?.toLocaleString(undefined, {
                maximumFractionDigits: 9,
              })}{" "}
              SOL ({escrowAmount} lamports)
            </strong>
            {fiatValue !== null && (
              <div style={{ marginTop: 4 }}>
                ≈{" "}
                <strong>
                  {fiatValue.toLocaleString(undefined, {
                    style: "currency",
                    currency: fiat,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>
            )}
          </div>
        )}
        <Button
          type="submit"
          fullWidth
          disabled={withdrawLoading || !initializer || !derivedPda}
          sx={{ mt: 2, borderRadius: 2, fontWeight: 600, fontSize: 16, py: 1 }}
        >
          {withdrawLoading ? "Withdrawing..." : "Withdraw"}
        </Button>
        {withdrawError && (
          <div style={{ color: "red", marginTop: 8 }}>{withdrawError}</div>
        )}
        {withdrawSuccess && (
          <div style={{ color: "green", marginTop: 8 }}>{withdrawSuccess}</div>
        )}
      </form>
    </Box>
  );
};

export default AccountWithdraw;
