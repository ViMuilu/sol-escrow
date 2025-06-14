import { describe, it, expect, beforeAll } from "vitest";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolEscrow } from "../target/types/sol_escrow.js";

anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.solEscrow as Program<SolEscrow>;
const provider = anchor.getProvider();

const initializer = anchor.web3.Keypair.generate();
const taker = anchor.web3.Keypair.generate();
let escrowAccount: anchor.web3.Keypair;

beforeAll(async () => {
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

describe("sol-escrow", () => {
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


    const escrow = await program.account.escrowAccount.fetch(escrowAccount.publicKey);
    expect(escrow.initializer.equals(initializer.publicKey)).toBe(true);
    expect(escrow.taker.equals(taker.publicKey)).toBe(true);
    expect(escrow.amount.eq(amount)).toBe(true);
  });

  it("Allows taker to withdraw", async () => {
    await program.methods
      .withdraw()
      .accounts({
        escrowAccount: escrowAccount.publicKey,
        taker: taker.publicKey,
      } as any)
      .signers([taker])
      .rpc();

   
    let threw = false;
    try {
      await program.account.escrowAccount.fetch(escrowAccount.publicKey);
    } catch (e) {
      threw = true;
    }
    expect(threw).toBe(true);
  });

  it("Allows initializer to cancel (after re-initializing)", async () => {
    // Re-initialize for cancel test
    escrowAccount = anchor.web3.Keypair.generate();
    const amount = new anchor.BN(2_000_000);

    await program.methods
      .initialize(taker.publicKey, amount)
      .accounts({
        escrowAccount: escrowAccount.publicKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([initializer, escrowAccount])
      .rpc();


    await program.methods
      .cancel()
      .accounts({
        escrowAccount: escrowAccount.publicKey,
        initializer: initializer.publicKey,
      } as any)
      .signers([initializer])
      .rpc();


    let threw = false;
    try {
      await program.account.escrowAccount.fetch(escrowAccount.publicKey);
    } catch (e) {
      threw = true;
    }
    expect(threw).toBe(true);
  });
});