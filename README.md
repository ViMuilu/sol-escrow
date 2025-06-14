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
4. **Set up your Solana keypair**
   ```bash
   solana-keygen new
   ```
5. **Configure Solana to use localnet**
   ```bash
   solana config set --url localhost
   ```
6. **Build the program**

   In a new terminal window:

   ```bash
   solana-test-validator
   ```

   ```bash
   anchor build
   anchor deploy
   ```

7. **Run tests**
   ```bash
   npm test
   ```
   or
   ```bash
   npx vitest run
   ```

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
