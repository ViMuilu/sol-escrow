import { useMemo, useState } from "react";
import {
  useWallet,
  useConnection,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import idl from "../../target/idl/sol_escrow.json";
import AccountLookup from "./tools/AccountLookup";
import InitializeEscrowForm from "./tools/InitializeEscrow";

import "./App.css";
import { PublicKey } from "@solana/web3.js";

const LOCALNET_RPC = "http://localhost:8899";

function App() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [error, setError] = useState<string | null>(null);

  const provider = useMemo(() => {
    if (
      !wallet.publicKey ||
      !wallet.signTransaction ||
      !wallet.signAllTransactions
    )
      return null;

    const anchorWallet = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    };
    return new AnchorProvider(
      connection,
      anchorWallet,
      AnchorProvider.defaultOptions()
    );
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(idl as any, provider);
  }, [provider]);

  // Handler for InitializeEscrowForm
  const handleInitialize = async (amount: number, takerInput: string) => {
    if (!program || !wallet.publicKey) return;

    // Input validation
    try {
      new PublicKey(takerInput); // throws if invalid
    } catch {
      alert("Invalid taker public key");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount");
      return;
    }

    try {
      const programId = new web3.PublicKey(idl.address);

      // Derive PDA for escrow account
      const [escrowPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), wallet.publicKey.toBuffer()],
        programId
      );

      await program.methods
        .initialize(new PublicKey(takerInput), new BN(amount))
        .accounts({
          escrowAccount: escrowPda,
          initializer: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      alert("Escrow initialized!");
    } catch (err) {
      alert("Error initializing escrow: " + err);
      console.error(err);
    }
  };

  return (
    <ConnectionProvider endpoint={LOCALNET_RPC}>
      <div>
        <h1>Sol Escrow UI</h1>
        <WalletMultiButton />
        <div className="escrow-container">
          <InitializeEscrowForm onInitialize={handleInitialize} />
          <AccountLookup program={program} />
          {wallet.connected && (
            <div>Wallet: {wallet.publicKey?.toBase58()}</div>
          )}
        </div>
      </div>
    </ConnectionProvider>
  );
}

export default App;
