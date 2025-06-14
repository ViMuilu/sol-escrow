import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolEscrow } from "../target/types/sol_escrow";
import { assert } from "chai";

describe("sol-escrow", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.solEscrow as Program<SolEscrow>;
  const provider = anchor.getProvider();

  // Generate keypairs for initializer and taker
  const initializer = anchor.web3.Keypair.generate();
  const taker = anchor.web3.Keypair.generate();
  let escrowAccount: anchor.web3.Keypair;

  before(async () => {
    // Airdrop SOL to initializer for fees
    const airdropSignature = await provider.connection.requestAirdrop(
      initializer.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    
    const latestBlockHash = await provider.connection.getLatestBlockhash();
    
    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    });
  });

  it("Initializes escrow", async () => {
    escrowAccount = anchor.web3.Keypair.generate();
    const amount = new anchor.BN(1_000_000);

    await program.methods
      .initialize(taker.publicKey, amount)
      .accounts({
        escrowAccount: escrowAccount.publicKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([initializer, escrowAccount])
      .rpc();

    // Fetch and check escrow account data
    const escrow = await program.account.escrowAccount.fetch(escrowAccount.publicKey);
    assert.ok(escrow.initializer.equals(initializer.publicKey));
    assert.ok(escrow.taker.equals(taker.publicKey));
    assert.ok(escrow.amount.eq(amount));
  });
});