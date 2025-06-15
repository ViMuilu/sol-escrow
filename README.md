# sol-escrow

A simple Solana escrow smart contract project built with [Anchor](https://book.anchor-lang.com/) to learn the basics of Solana smart contracts and Rust.

## Features

- Written in Rust using the Anchor framework
- Basic escrow logic: initialize and withdraw instructions
- TypeScript tests using [Vitest](https://vitest.dev/)
- Example of SOL airdrop and account setup
- **Modern React UI** using [Material UI (MUI)](https://mui.com/) and [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Anchor CLI](https://book.anchor-lang.com/getting_started/installation.html)

## Setup

1. **Clone the repository**

   ```bash
   git clone <this-repo-url>
   cd sol_escrow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Anchor CLI**

   ```bash
   cargo install --git https://github.com/coral-xyz/anchor --tag v0.31.1 anchor-cli --locked
   ```

4. **Start the Solana test validator**

   Open a new terminal window and run:

   ```bash
   solana-test-validator
   ```

5. **Set up your Solana keypairs for test validator**

   In a separate terminal, generate wallets for each role:

   ```bash
   solana-keygen new --outfile ~/.config/solana/initializer.json
   solana-keygen new --outfile ~/.config/solana/taker.json
   solana-keygen new --outfile ~/.config/solana/escrow.json
   ```

   Then fund each wallet using the test validator:

   ```bash
   solana airdrop 5 ~/.config/solana/initializer.json --url localhost
   solana airdrop 5 ~/.config/solana/taker.json --url localhost
   solana airdrop 5 ~/.config/solana/escrow.json --url localhost
   ```

   If the airdrop hangs

   ```bash
   solana-test-validator --reset
   ```

   You can switch between wallets for CLI commands like this:

   ```bash
   solana config set --keypair ~/.config/solana/initializer.json
   ```

   Or use the `--keypair` flag for one-off commands:

   ```bash
   solana balance --keypair ~/.config/solana/taker.json
   ```

6. **Configure Solana to use localnet**

   ```bash
   solana config set --url localhost
   ```

7. **Build and deploy the program**

   ```bash
   anchor build
   anchor deploy
   ```

8. **Run tests**
   ```bash
   npm test
   ```
   or
   ```bash
   npx vitest run
   ```

<details>
<summary><strong>How to Create All Necessary Wallets for Development</strong></summary>

You may want multiple wallets for testing different roles (e.g., initializer, taker, escrow). Here’s how to create and manage them:

### 1. **Create Multiple Keypairs**

Generate a new wallet for each role:

```bash
solana-keygen new --outfile ~/.config/solana/initializer.json
solana-keygen new --outfile ~/.config/solana/taker.json
solana-keygen new --outfile ~/.config/solana/escrow.json
```

### 2. **Airdrop SOL to Each Wallet**

Make sure your local validator is running, then fund each wallet:

```bash
solana airdrop 5 ~/.config/solana/initializer.json --url localhost
solana airdrop 5 ~/.config/solana/taker.json --url localhost
solana airdrop 5 ~/.config/solana/escrow.json --url localhost
```

Or, to airdrop by address:

```bash
solana airdrop 5 <WALLET_ADDRESS> --url localhost
```

Get the address with:

```bash
solana-keygen pubkey ~/.config/solana/initializer.json
```

### 3. **Switch Between Wallets in CLI**

Set the active wallet for CLI commands:

```bash
solana config set --keypair ~/.config/solana/initializer.json
```

Or use `--keypair` for one-off commands:

```bash
solana balance --keypair ~/.config/solana/taker.json
```

### 4. **Use Wallets in Scripts/Frontend**

In Node.js/TypeScript:

```js
const { Keypair } = require("@solana/web3.js");
const fs = require("fs");
const secret = JSON.parse(fs.readFileSync("/path/to/initializer.json"));
const keypair = Keypair.fromSecretKey(Uint8Array.from(secret));
```

### 5. **(Optional) Import into Browser Wallets**

If you want to use these wallets in Phantom/Brave:

- Open the wallet extension, choose "Import Private Key," and paste the array from your `.json` file.

</details>

## UI (Frontend)

- The UI is located in the `sol-escrow-ui` folder.
- Built with **React** and **Material UI (MUI)** for modern, responsive components.
- Uses **Solana Wallet Adapter** for wallet connection and transaction signing.
- Key UI packages:
  - `@mui/material`
  - `@emotion/react`
  - `@emotion/styled`
  - `@solana/wallet-adapter-react`
  - `@solana/wallet-adapter-wallets`
  - `@solana/wallet-adapter-react-ui`
  - `@solana/web3.js`
  - `@coral-xyz/anchor`

### To run the UI locally:

```bash
cd sol-escrow-ui
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

- [`programs/sol-escrow/`](programs/sol-escrow/) - Rust smart contract (Anchor program)
- [`tests/sol-escrow.test.ts`](tests/sol-escrow.test.ts) - TypeScript integration tests
- [`target/idl/sol_escrow.json`](target/idl/sol_escrow.json) - Generated IDL for the program
- [`sol-escrow-ui/`](sol-escrow-ui/) - React frontend UI

## Notes

- If you see warnings about deprecated methods or Node module types, they can usually be ignored for learning and local development.
- For more information on Anchor, see the Anchor Book.
