import { useState, useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import idl from "../../target/idl/sol_escrow.json";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const { connection } = useConnection();
  const wallet = useWallet();

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

  return (
    <>
      <div>
        <h1>Sol Escrow UI</h1>
        <WalletMultiButton />
        <div className="escrow-container">
          {wallet.connected ? (
            <div className="escrow-wallet-box">
              <div> Wallet: {wallet.publicKey?.toBase58()}</div>
              <div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!program || !wallet.publicKey) return;

                    const takerPubkey = (e.target as any).takerPubkey.value;
                    const amount = Number((e.target as any).amount.value);

                    const escrowAccount = web3.Keypair.generate();

                    try {
                      await program.methods
                        .initialize(
                          new web3.PublicKey(takerPubkey),
                          new BN(amount)
                        )
                        .accounts({
                          escrowAccount: escrowAccount.publicKey,
                          initializer: wallet.publicKey,
                          systemProgram: web3.SystemProgram.programId,
                        })
                        .signers([escrowAccount])
                        .rpc();

                      alert(
                        "Escrow initialized! Escrow account: " +
                          escrowAccount.publicKey.toBase58()
                      );
                    } catch (err) {
                      alert("Error initializing escrow: " + err);
                      console.error(err);
                    }
                  }}
                  className="escrow-form"
                >
                  <label>
                    Taker Public Key:
                    <input name="takerPubkey" type="text" required />
                  </label>
                  <label>
                    Escrow Amount:
                    <input
                      name="amount"
                      type="number"
                      min="0"
                      step="any"
                      required
                    />
                  </label>
                  <button type="submit">Initialize</button>
                </form>
              </div>
            </div>
          ) : (
            <div>Connect your wallet</div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
