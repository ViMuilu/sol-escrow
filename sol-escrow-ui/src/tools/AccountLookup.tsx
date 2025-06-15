import React, { useState } from "react";
import { Program } from "@coral-xyz/anchor";

type Props = {
  program: Program | null;
};

const AccountLookup: React.FC<Props> = ({ program }) => {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<any>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setResult(null);

    try {
      if (!program) throw new Error("Program not loaded");
      const accountInfo = await program.account.escrow.fetch(account.trim());
      setResult(accountInfo);
    } catch (err: any) {
      setError(err.message || "Error looking up account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLookup} style={{ maxWidth: 400, margin: "0 auto" }}>
      <label htmlFor="escrow-account">Escrow Account Address</label>
      <input
        id="escrow-account"
        type="text"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        placeholder="Enter escrow account address"
        style={{ width: "100%", marginBottom: 8 }}
        disabled={loading}
        required
      />
      <button type="submit" disabled={loading || !account.trim()}>
        {loading ? "Looking up..." : "Lookup"}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {result && (
        <pre style={{ marginTop: 8, background: "#f5f5f5", padding: 8 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </form>
  );
};

export default AccountLookup;
